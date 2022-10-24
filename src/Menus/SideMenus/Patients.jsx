import React, { useEffect, useState } from 'react';
import { db } from '../../API/firebase';
import PatientsInfo from '../../Pages/PatientsInfo';
// import MyTable from "../../Components/Tables/Table2/MyTable";

const Patients = () => {
  const [files, setFiles] = useState([]);

  const getPatients = async () => {
    const patientsRef = await db.collection('kiosk');

    patientsRef.onSnapshot((querySnapshot) => {
      const patientsList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataWithId = { ...data, id: doc.id };
        patientsList.push(dataWithId);
      });
      setFiles(patientsList);
    });
  };

  useEffect(() => {
    getPatients();
  }, []);

  return <PatientsInfo />;
};

export default Patients;
