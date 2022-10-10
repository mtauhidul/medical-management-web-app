import * as React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AddBtn from "../../Components/Buttons/AddBtn/AddBtn";

import readXlsxFile from "read-excel-file";
import * as FaIcons from "react-icons/fa";

import styles from "./PatientsInfo.module.scss";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { usePatientInformationContext } from "../../context/PatientsInformationContext";

const PatientsInfo = () => {
  const fileRef = React.useRef();
  const { patientsInfo, setPatientsInfo } = usePatientInformationContext();

  const uploadFile = (e) => {
    const file = e.target.files[0];

    if (file.name.split(".")[1] !== "xlsx")
      return toast.error("Please upload a valid file");

    const patientData = readXlsxFile(file).then((rows) => {
      const removeFirstArray = rows.slice(1);
      const patientsTodaysData = {
        date: new Date().toLocaleString(),
        patients: removeFirstArray,
      };

      return patientsTodaysData;
    });

    patientData.then((data) => {
      setPatientsInfo((prevData) => {
        return [...prevData, data];
      });
    });
  };

  const getData = () => {
    fileRef.current.click();
  };

  return (
    <section className={styles._wrapper}>
      <Container maxWidth="xl">
        <input
          type="file"
          hidden
          accept=".xlsx,.xls"
          ref={fileRef}
          onChange={uploadFile}
        />

        <Box className={styles._box}>
          <AddBtn
            title="Import excel file"
            makeStyle={{
              whiteSpace: "nowrap",
              width: "170px",
            }}
            handleClick={getData}
          />
        </Box>

        <Box
          style={{
            marginTop: "2rem",
          }}
        >
          <Grid container spacing={3}>
            {patientsInfo
              ?.sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((item, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Info item={item} />
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Container>
    </section>
  );
};

export default PatientsInfo;

const Info = ({ item }) => {
  const [hovered, setHovered] = React.useState(false);
  const slug = item.date.split("/").join("-").split(" ").join("&");

  return (
    <Link to={`/admin/patients/${slug}`} className={styles.hovered}>
      <Box
        className={`${styles._box} ${styles._data_box}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered ? (
          <h3>
            <FaIcons.FaEye /> View
          </h3>
        ) : (
          <>
            <h3>{new Date(item.date).toLocaleDateString()}</h3>
            <p style={{ color: "blue" }}>{item.patients.length}</p>
          </>
        )}
      </Box>
    </Link>
  );
};
