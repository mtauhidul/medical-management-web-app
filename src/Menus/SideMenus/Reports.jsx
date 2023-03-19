import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { db } from '../../API/firebase';
import styles from './Reports.module.css';

const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  {
    name: 'Page B',
    uv: 300,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 200,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 278,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 189,
    pv: 4800,
    amt: 2181,
  },
];

const Reports = () => {
  const [staffData, setStaffData] = useState([]);
  const [patientData, setPatientData] = useState([]);

  const getData = () => {
    db.collection('patientsData')
      .where('status', '==', 'Completed')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setStaffData((prev) => [
            ...prev,
            {
              name: 'A',
              staff: doc.data().kiosk.activity_time.staff,
              doctor: doc.data().kiosk.activity_time.doctor,
              total:
                doc.data().kiosk.activity_time.staff +
                doc.data().kiosk.activity_time.doctor,
            },
          ]);
        });
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  };

  const staffLength = staffData.length;
  const staffTotal = staffData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.total;
  }, 0);

  const staffAverage = parseFloat(staffTotal) / staffLength;

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.reportsContainer}>
      <ResponsiveContainer width='50%' height='50%'>
        <LineChart
          width={500}
          height={300}
          data={staffData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='total'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
          />
          {/* <Line type='monotone' dataKey='staff' stroke='#82ca9d' /> */}
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width='50%' height='50%'>
        <LineChart
          width={500}
          height={300}
          data={staffData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='total'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
          />
          {/* <Line type='monotone' dataKey='staff' stroke='#82ca9d' /> */}
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width='50%' height='50%'>
        <LineChart
          width={500}
          height={300}
          data={staffData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='total'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
          />
          {/* <Line type='monotone' dataKey='staff' stroke='#82ca9d' /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Reports;
