import React, { useEffect, useState } from 'react';
import { db } from '../../API/firebase';
import styles from './Reports.module.css';

const Reports = () => {
  const [staffData, setStaffData] = useState([]);
  const [patientData, setPatientData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [avgStaffActivity, setAvgStaffActivity] = useState(0);
  const [avgPatientActivity, setAvgPatientActivity] = useState(0);
  const [avgDoctorActivity, setAvgDoctorActivity] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const getData = () => {
    const search = '/';
    const replaceWith = '-';
    db.collection('patientsData')
      .where('status', '==', 'Completed')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setStaffData((prev) => [
            ...prev,
            {
              id: doc.id,
              date: doc
                .data()
                .date.slice(0, 10)
                .split(search)
                .join(replaceWith),
              value: doc.data().kiosk.activity_time.staff,
            },
          ]);

          setPatientData((prev) => [
            ...prev,
            {
              id: doc.id,
              date: doc
                .data()
                .date.slice(0, 10)
                .split(search)
                .join(replaceWith),
              value: doc.data().kiosk.activity_time.patient,
            },
          ]);

          setDoctorData((prev) => [
            ...prev,
            {
              id: doc.id,
              date: doc
                .data()
                .date.slice(0, 10)
                .split(search)
                .join(replaceWith),
              value: doc.data().kiosk.activity_time.doctor,
            },
          ]);
        });
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  };

  const calculateAverage = (data) => {
    let sum = 0;
    data.forEach((item) => {
      sum += item.value;
    });
    return sum / data.length;
  };

  // A function that will find out object dates fall between two dates

  const filterByDate = (data, start, end) => {
    const filteredData = data.filter((item) => {
      return item.date >= start && item.date <= end;
    });
    return filteredData;
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (staffData.length > 0) {
      setAvgStaffActivity(calculateAverage(staffData));
    }
  }, [staffData]);

  useEffect(() => {
    if (patientData.length > 0) {
      setAvgPatientActivity(calculateAverage(patientData));
    }
  }, [patientData]);

  useEffect(() => {
    if (doctorData.length > 0) {
      setAvgDoctorActivity(calculateAverage(doctorData));
    }
  }, [doctorData]);

  useEffect(() => {
    console.log(staffData);
    console.log(doctorData);
    console.log(patientData);
    console.log('----------');
    console.log(startTime);
    console.log(endTime);
  }, [staffData, patientData, doctorData, startTime, endTime]);

  return (
    <div className={styles.reportsContainer}>
      <div className={styles.reports}>
        <div className={styles.reportsHeader}>
          <h1>Reports</h1>
          <hr />
        </div>
        <div className={styles.reportsBody}>
          <div className={styles.reportsBodyHeader}>
            <h2>Activity Time</h2>
          </div>
          <hr />
          <div className={styles.reportsBodyFilter}>
            <div className={styles.reportsBodyFilterItem}>
              <label htmlFor='start'>Start Date</label>
              <br />
              <input
                type='date'
                id='start'
                name='trip-start'
                value={startTime}
                onChange={(e) => {
                  const date = e.target.value.split('-');
                  const newDate = `${date[2]}-${date[1]}-${date[0]}`;
                  setStartTime(newDate);
                }}
              />
            </div>
            <div className={styles.reportsBodyFilterItem}>
              <label htmlFor='end'>End Date</label>
              <br />
              <input
                type='date'
                id='end'
                name='trip-end'
                value={endTime}
                onChange={(e) => {
                  const date = e.target.value.split('-');
                  const newDate = `${date[2]}-${date[1]}-${date[0]}`;
                  setEndTime(newDate);
                }}
              />
            </div>
            <div className={styles.reportsBodyFilterItem}>
              <label
                style={{
                  visibility: 'hidden',
                }}
                htmlFor='filter'>
                Filter
              </label>
              <br />
              <button
                onClick={() => {
                  setStaffData(filterByDate(staffData, startTime, endTime));
                  setPatientData(filterByDate(patientData, startTime, endTime));
                  setDoctorData(filterByDate(doctorData, startTime, endTime));
                }}>
                Filter
              </button>
            </div>
          </div>

          <div className={styles.reportsBodyContent}>
            <div className={styles.reportsBodyContentItem}>
              <h3>Average Staff Activity Time</h3>
              <p>{(avgStaffActivity / 60).toFixed(3)} minutes</p>
            </div>
            <div className={styles.reportsBodyContentItem}>
              <h3>Average Patient Activity Time</h3>
              <p>{(avgPatientActivity / 60).toFixed(3)} minutes</p>
            </div>
            <div className={styles.reportsBodyContentItem}>
              <h3>Average Doctor Activity Time</h3>
              <p>{(avgDoctorActivity / 60).toFixed(3)} minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
