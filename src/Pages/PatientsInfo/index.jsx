import * as React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import AddBtn from "../../Components/Buttons/AddBtn/AddBtn";
import readXlsxFile from "read-excel-file";
import toast from "react-hot-toast";

import {
  addPatientsData,
  getPatientsData,
  removeAllPatientsData,
} from "../../API/Api";
import { usePatientInformationContext } from "../../context/PatientsInformationContext";
import styles from "./PatientsInfo.module.scss";
import Info from "./Info";
import FilteredPatientsData from "./FilteredPatientsData";
import ConditionalRendering from "./ConditionalRendering";

const PatientsInfo = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthAndYear = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const fileRef = React.useRef();
  const { patientsInfo, setPatientsInfo } = usePatientInformationContext();
  const [filteredBy, setFilteredBy] = React.useState(currentMonthAndYear);
  const [filteredData, setFilteredData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [day, setDay] = React.useState(new Date().getDate());
  const [filteredByDay, setFilteredByDay] = React.useState(false);

  const getAllPatientsData = async () => {
    const response = await getPatientsData();
    if (response) {
      const groups = response.reduce((acc, item) => {
        if (!acc[item?.date?.split(", ")[0]]) {
          acc[item?.date?.split(", ")[0]] = [];
        }

        acc[item?.date?.split(", ")[0]].push(item);
        return acc;
      }, {});

      // Loop through groups and push them tp an array of groups following the structure described below
      // [
      //   {
      //     date: key,
      //     patients: value,
      //   }
      // ]

      for (const [key, value] of Object.entries(groups)) {
        setPatientsInfo((prevData) => [
          ...prevData,
          { date: key, patients: groups[key] },
        ]);
      }

      if (patientsInfo.length > 0) {
        let uniqueData = [...new Set(patientsInfo)];
        setPatientsInfo(uniqueData);
      }

      setLoading(false);

      // for (const [key, value] of Object.entries(groups)) {
      //   const newArray = [];
      //   newArray.push({ date: key, patients: value });
      //   return newArray;
      // }
    } else {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (PatientsInfo.length <= 0) {
      getAllPatientsData();
    }
  }, []);

  const uploadFile = (e) => {
    const file = e.target.files[0];

    if (file.name?.split(".")[1] !== "xlsx")
      return toast.error("Please upload a valid file");

    const patientData = readXlsxFile(file).then((rows) => {
      const removeFirstArray = rows.slice(1);
      const patientsTodaysData = {
        date: new Date().toLocaleString(),
        patients: removeFirstArray,
      };

      return patientsTodaysData;
    });

    patientData.then(async (data) => {
      data.patients.map(async (patient) => {
        await addPatientsData({
          date: data.date,
          data: patient,
          arrTime: "",
          duration: "",
          room: "",
          status: "",
          kiosk: {},
        });
      });
    });
    getAllPatientsData();
  };

  const getData = () => {
    fileRef.current.click();
  };

  const filteredByDate = (date) => {
    setFilteredByDay(true);
    const filteredData = patientsInfo.filter((info) => {
      return info.date.split("/")[0] === date;
    });
    setFilteredData(filteredData);
  };

  const filteredByMonthAndYear = (selectedMonthAndYear) => {
    const filteredData = patientsInfo.filter((item) => {
      const segment = item.date.split("/");
      const month = months[segment[1] - 1];
      const year = segment[2];
      const MonthAndYear = `${month} ${year}`;

      return MonthAndYear === filteredBy || selectedMonthAndYear;
    });

    setFilteredData(filteredData);
    setDay(new Date().getDate());
    setFilteredByDay(false);
  };

  const removeData = async (info) => {
    info.patients.map(async (patient) => {
      const response = await removeAllPatientsData(patient.id);
      if (response) {
        setPatientsInfo([]);
        setFilteredData([]);
      }
    });
  };

  React.useEffect(() => {
    filteredByMonthAndYear();
  }, [filteredBy]);

  React.useEffect(() => {
    if (patientsInfo || filteredData) {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [filteredData, patientsInfo]);

  return (
    <section className={styles._wrapper}>
      <Container maxWidth="xl">
        <input
          type="file"
          hidden
          accept=".xlsx"
          ref={fileRef}
          onChange={uploadFile}
        />

        <Box className={styles._box}>
          <Box>
            <h1>Upload Your Patients Information</h1>

            <FilteredPatientsData
              filteredByDay={filteredByDay}
              day={day}
              setDay={setDay}
              patientsInfo={patientsInfo}
              filteredByDate={filteredByDate}
              filteredBy={filteredBy}
              setFilteredBy={setFilteredBy}
              filteredByMonthAndYear={filteredByMonthAndYear}
            />
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
          <ConditionalRendering
            loading={loading}
            patientsInfo={patientsInfo}
            filteredData={filteredData}
          />

          <Grid container spacing={3}>
            {patientsInfo &&
              !loading &&
              filteredData.map((item, index) => {
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
