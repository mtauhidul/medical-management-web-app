import React, { useEffect, useState } from 'react';
import { db } from '../../API/firebase';

const Patients = () => {
  const [files, setFiles] = useState([]);

  const getPatients = async () => {
    const patientsRef = db.collection('kiosk');

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

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Under Development</h1>
      <ul>
        {files.map((file) => {
          return <li key={file.id}>{file.id}</li>;
        })}
      </ul>
    </div>
  );
};

export default Patients;
