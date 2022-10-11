import React from "react";
import { useHistory } from "react-router";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { usePatientInformationContext } from "../../context/PatientsInformationContext";
import styles from "./Header.module.scss";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

const Header = ({ patientData }) => {
  const { patientsInfo } = usePatientInformationContext();
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const next = () => {
    const index = patientsInfo.findIndex(
      (data) => data.date === patientData.date
    );
    const nextIndex = index + 1;
    const nextData = patientsInfo[nextIndex];

    const slug = nextData.date.split("/").join("-").split(" ").join("&");
    if (nextData) {
      history.replace(`/admin/patients/${slug}`);
    }
  };

  const prev = () => {
    const index = patientsInfo.findIndex(
      (data) => data.date === patientData.date
    );
    const prevIndex = index - 1;
    const prevData = patientsInfo[prevIndex];
    const slug = prevData.date.split("/").join("-").split(" ").join("&");
    if (prevData) {
      history.replace(`/admin/patients/${slug}`);
    }
  };

  // disabled button when it'll the first or last data
  const isDisabled = (type) => {
    const index = patientsInfo.findIndex(
      (data) => data.date === patientData.date
    );
    if (type === "next") {
      return index === patientsInfo.length - 1;
    } else if (type === "prev") {
      return index === 0;
    }
  };

  return (
    <header className={styles._wrapper}>
      <div
        style={{
          textAlign: "left",
        }}
      >
        <Button size="small" className={styles._btn} onClick={goBack}>
          go back
        </Button>
        <p>
          Created at:
          <IconButton onClick={prev} disabled={isDisabled("prev")}>
            <MdOutlineArrowBackIos />
          </IconButton>
          <span
            style={{
              pointerEvents: "none",
            }}
          >
            {new Date(patientData?.date).toLocaleString()}
          </span>{" "}
          <IconButton onClick={next} disabled={isDisabled("next")}>
            <MdOutlineArrowForwardIos />
          </IconButton>
        </p>
      </div>
      <div>
        <h1>Patients Information</h1>
        <small>Total Patients: {patientData?.patients?.length}</small>
      </div>
    </header>
  );
};

export default Header;
