import React, { useEffect, useState } from 'react';
import { db } from '../../API/firebase';
import { usePatientInformationContext } from '../../context/PatientsInformationContext';
import PatientsInfo from '../../Pages/PatientsInfo';
// import MyTable from "../../Components/Tables/Table2/MyTable";

const Patients = () => {
  const [files, setFiles] = useState([]);
  const { patientsInfo, setPatientsInfo } = usePatientInformationContext();

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
          const newArray = [];
          for (const [key, value] of Object.entries(groups)) {
            newArray.push({ date: key, patients: groups[key] });
          }
          if (newArray.length > 0) {
            setFiles(newArray);
            setPatientsInfo(newArray);
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
