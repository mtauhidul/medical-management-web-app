import React from "react";
import styles from "./Header.module.scss";

const Header = ({ patientData }) => {
  return (
    <header className={styles._wrapper}>
      <h1>Patients Information</h1>
      <p>Created at: {new Date(patientData?.date).toLocaleString()}</p>
      <small>Total Patients: {patientData?.patients?.length}</small>
    </header>
  );
};

export default Header;
