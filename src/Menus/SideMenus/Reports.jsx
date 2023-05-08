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
  const [startTime, setStartTime] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .slice(0, 10)
  );
  const [endTime, setEndTime] = useState(
    // Set the end time one day ahead of the current date
    new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .slice(0, 10)
  );

  // console.log('Starting date: ', startTime);
  // console.log('Ending date: ', endTime);

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

  // A function that will find out object dates fall between two dates

  const filterByDate = (data, startDate, endDate) => {
    const filteredData = data.filter((item) => {
      const date = item.date.split('-');
      const newDate = `${date[2]}-${date[1]}-${date[0]}`;
      const itemDate = new Date(newDate);
      const start = new Date(startDate);
      const end = new Date(endDate);

      return itemDate >= start && itemDate <= end;
    });
    // console.log('Filtered data: ', filteredData);
    return filteredData;
  };

  const calculateAverage = (data) => {
    const filteredData = filterByDate(data, startTime, endTime);
    // An array of times in "15:30" format
    const times = filteredData;

    // console.log(times);

    // Convert each time to seconds and add them up
    const totalSeconds = times.reduce((acc, time) => {
      // console.log('Time: ', time);

      if (time.value === 0) {
        return acc;
      } else {
        const [minutes, seconds] = time.value.split(':');
        return acc + Number(minutes) * 60 + Number(seconds);
      }
    }, 0);

    console.log(totalSeconds);

    // Calculate the average number of seconds
    const averageSeconds = totalSeconds / times.length;

    // Convert the average number of seconds back to "15:30" format
    const minutes = Math.floor(averageSeconds / 60);
    const seconds = Math.floor(averageSeconds % 60);
    const averageTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // console.log(averageTime);
    return averageTime;
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
      // console.log(doctorData);
      setAvgDoctorActivity(calculateAverage(doctorData));
    }
  }, [doctorData]);

  useEffect(() => {
    // console.log(staffData);
    // console.log(doctorData);
    // console.log(patientData);
    // console.log('----------');
    // console.log(startTime);
    // console.log(endTime);
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
                className={styles.reportsBodyFilterItemInput}
                type='date'
                id='start'
                name='trip-start'
                value={startTime}
                onChange={(e) => {
                  const date = e.target.value.split('-');
                  const newDate = `${date[0]}-${date[1]}-${date[2]}`;
                  setStartTime(newDate);
                }}
              />
            </div>
            <div className={styles.reportsBodyFilterItem}>
              <label htmlFor='end'>End Date</label>
              <br />
              <input
                className={styles.reportsBodyFilterItemInput}
                type='date'
                id='end'
                name='trip-end'
                value={endTime}
                onChange={(e) => {
                  const date = e.target.value.split('-');
                  const newDate = `${date[0]}-${date[1]}-${date[2]}`;
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
                className={styles.reportsBodyFilterItemButton}
                onClick={() => {
                  getData();
                }}>
                Filter
              </button>
            </div>
          </div>

          <div className={styles.reportsBodyContent}>
            <div className={styles.reportsBodyContentItem}>
              <h3>Average Staff Activity Time</h3>
              <p>
                {avgStaffActivity !== 'NaN:NaN' ? avgStaffActivity : 0} minutes
              </p>
            </div>
            <div className={styles.reportsBodyContentItem}>
              <h3>Average Doctor Activity Time</h3>
              <p>
                {avgDoctorActivity !== 'NaN:NaN' ? avgDoctorActivity : 0}{' '}
                minutes
              </p>
            </div>
            <div className={styles.reportsBodyContentItem}>
              <h3>Average Patient Activity Time</h3>
              <p>
                {avgPatientActivity !== 'NaN:NaN' ? avgPatientActivity : 0}{' '}
                minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
