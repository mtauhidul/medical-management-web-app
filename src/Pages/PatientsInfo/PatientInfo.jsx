import * as React from "react";
import { useParams, useHistory } from "react-router";
import PatientsTable from "../../Components/Tables/PatientsTable";
import { usePatientInformationContext } from "../../context/PatientsInformationContext";
import Header from "./Header";
import styles from "./PatientInfo.module.scss";

const PatientInfo = () => {
  const { patientsInfo } = usePatientInformationContext();
  const { date } = useParams();
  const extractDateFromUrl = date.split("-").join("/").split("&").join(" ");

  const patientData = patientsInfo?.find(
    (data) => data.date === extractDateFromUrl
  );

  const history = useHistory();

  React.useEffect(() => {
    if (!patientData) {
      history.push("/admin/patients");
    }
  }, [history, patientData]);

  return (
    <section className={styles._wrapper}>
      <Header patientData={patientData} />
      <PatientsTable patientData={patientData} />
    </section>
  );
};

export default PatientInfo;
