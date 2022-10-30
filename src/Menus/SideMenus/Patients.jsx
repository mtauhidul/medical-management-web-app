import React, { useEffect, useState } from 'react';
import { db } from '../../API/firebase';
import PatientsInfo from '../../Pages/PatientsInfo';
// import MyTable from "../../Components/Tables/Table2/MyTable";

const Patients = () => {
  const [files, setFiles] = useState([]);

  const getPatients = async () => {
    const patientsRef = await db.collection('patientsData');

    patientsRef.onSnapshot((querySnapshot) => {
      const patientsList = [];
      querySnapshot.forEach((doc) => {
        patientsList.push({ id: doc.id, ...doc.data() });
      });
      if (patientsList.length > 0) {
        const groups = patientsList.reduce((acc, item) => {
          if (!acc[item?.date?.split(', ')[0]]) {
            acc[item?.date?.split(', ')[0]] = [];
          }

          acc[item?.date?.split(', ')[0]].push(item);
          return acc;
        }, {});
        if (groups) {
          for (const [key, value] of Object.entries(groups)) {
            setFiles((prevData) => [
              ...prevData,
              { date: key, patients: groups[key] },
            ]);
          }
        }
      }
    });
  };

  useEffect(() => {
    getPatients();
  }, []);

  console.log('files', files);

  return <PatientsInfo patientsData={files} />;
};

export default Patients;
