import * as React from "react";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AddBtn from "../../Components/Buttons/AddBtn/AddBtn";
import { FormControl, MenuItem, Select } from "@material-ui/core";

import readXlsxFile from "read-excel-file";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

import styles from "./PatientsInfo.module.scss";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { usePatientInformationContext } from "../../context/PatientsInformationContext";

const PatientsInfo = () => {
  const year = new Date().getFullYear();
  const listOfMonthWithYear = [
    `January ${year}`,
    `February ${year}`,
    `March ${year}`,
    `April ${year}`,
    `May ${year}`,
    `June ${year}`,
    `July ${year}`,
    `August ${year}`,
    `September ${year}`,
    `October ${year}`,
    `November ${year}`,
    `December ${year}`,
  ];

  const currentMonthAndYear = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const fileRef = React.useRef();
  const { patientsInfo, setPatientsInfo } = usePatientInformationContext();
  const [filteredBy, setFilteredBy] = React.useState(currentMonthAndYear);
  const [filteredData, setFilteredData] = React.useState([]);

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

  const filteredByMonthAndYear = (selectedMonthAndYear) => {
    const filteredData = patientsInfo.filter((item) => {
      const MonthAndYear = new Date(item.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      return MonthAndYear === filteredBy || selectedMonthAndYear;
    });

    setFilteredData(filteredData);
  };

  const removeData = (index) => {
    const filteredData = patientsInfo.filter((item, i) => i !== index);
    setPatientsInfo(filteredData);
  };

  React.useEffect(() => {
    filteredByMonthAndYear();
  }, [filteredBy, patientsInfo]);

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
          <Box>
            <h1>Upload Your Patients Information</h1>

            <Box
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: "1rem",
                justifyContent: "flex-start",
              }}
            >
              <p
                style={{
                  marginTop: "0.5rem",
                }}
              >
                Filtered By Month:
              </p>

              <FormControl
                style={{
                  flex: "1 1 auto",
                  backgroundColor: "inherit",
                }}
              >
                <Select
                  disabled={patientsInfo.length === 0}
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={filteredBy}
                  label={filteredBy}
                  onChange={(e) => setFilteredBy(e.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid #000000",
                    padding: "0 0.5rem",
                    backgroundColor: "inherit",
                  }}
                >
                  {listOfMonthWithYear.map((month, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={month}
                        style={{
                          backgroundColor: "inherit",
                        }}
                        onClick={() => filteredByMonthAndYear(month)}
                      >
                        {month}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <AddBtn
            title="Import file"
            makeStyle={{
              whiteSpace: "nowrap",
              width: "170px",
              textTransform: "uppercase",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
            handleClick={getData}
          />
        </Box>

        <Box
          style={{
            marginTop: "2rem",
          }}
        >
          {patientsInfo.length === 0 && (
            <h1
              style={{
                textAlign: "center",
                marginTop: "5rem",
              }}
            >
              <FaIcons.FaExclamationTriangle
                style={{
                  color: "#F7C110",
                  fontSize: "2rem",
                }}
              />{" "}
              There has no information
            </h1>
          )}

          {filteredData.length === 0 && patientsInfo.length >= 1 && (
            <h1
              style={{
                textAlign: "center",
                marginTop: "5rem",
              }}
            >
              <FaIcons.FaExclamationTriangle
                style={{
                  color: "#F7C110",
                  fontSize: "2rem",
                }}
              />{" "}
              This month has not patient information
            </h1>
          )}

          <Grid container spacing={3}>
            {filteredData
              ?.sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((item, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Info index={index} item={item} removeData={removeData} />
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

const Info = ({ item, removeData, index }) => {
  const [hovered, setHovered] = React.useState(false);
  const slug = item.date.split("/").join("-").split(" ").join("&");

  return (
    <Box
      style={{
        position: "relative",
      }}
    >
      <Box className={styles._icon_box}>
        <MdIcons.MdCancel
          onClick={() => removeData(index)}
          className={styles._icon}
          title="Remove"
        />
      </Box>
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
    </Box>
  );
};
