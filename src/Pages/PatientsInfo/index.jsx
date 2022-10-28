import { FormControl, MenuItem, Select } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import AddBtn from '../../Components/Buttons/AddBtn/AddBtn';

import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import readXlsxFile from 'read-excel-file';

import toast from 'react-hot-toast';
import { LineWave } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import {
  addPatientsData,
  getPatientsData,
  removeAllPatientsData,
} from '../../API/Api';
import { usePatientInformationContext } from '../../context/PatientsInformationContext';
import styles from './PatientsInfo.module.scss';

const PatientsInfo = () => {
  const year = new Date().getFullYear();
  const listOfMonthWithYear = [
    `January ${year}`,
    `February ${year}`,
    `March ${year}`,
    `April ${year}`,
    `May ${year}`,
    `June ${year}`,
    `July ${year}`,
    `August ${year}`,
    `September ${year}`,
    `October ${year}`,
    `November ${year}`,
    `December ${year}`,
  ];

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentMonthAndYear = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const fileRef = React.useRef();
  const { patientsInfo, setPatientsInfo } = usePatientInformationContext();
  const [filteredBy, setFilteredBy] = React.useState(currentMonthAndYear);
  const [filteredData, setFilteredData] = React.useState([]);
  const [initialData, setInitialData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getAllPatientsData = async () => {
    const response = await getPatientsData();
    if (response) {
      const groups = response.reduce((acc, item) => {
        if (!acc[item?.date?.split(', ')[0]]) {
          acc[item?.date?.split(', ')[0]] = [];
        }

        acc[item?.date?.split(', ')[0]].push(item);
        return acc;
      }, {});

      // Loop through groups and push them tp an array of groups following the structure described below
      // [
      //   {
      //     date: key,
      //     patients: value,
      //   }
      // ]

      for (const [key, value] of Object.entries(groups)) {
        setPatientsInfo((prevData) => [
          ...prevData,
          { date: key, patients: groups[key] },
        ]);
      }

      if (patientsInfo.length > 0) {
        let uniqueData = [...new Set(patientsInfo)];
        setPatientsInfo(uniqueData);
      }

      // for (const [key, value] of Object.entries(groups)) {
      //   const newArray = [];
      //   newArray.push({ date: key, patients: value });
      //   return newArray;
      // }
    } else {
      toast.error('Something went wrong');
    }
  };

  React.useEffect(() => {
    if (PatientsInfo.length <= 0) {
      getAllPatientsData();
    }
  }, []);

  const uploadFile = (e) => {
    const file = e.target.files[0];

    if (file.name?.split('.')[1] !== 'xlsx')
      return toast.error('Please upload a valid file');

    const patientData = readXlsxFile(file).then((rows) => {
      const removeFirstArray = rows.slice(1);
      const patientsTodaysData = {
        date: new Date().toLocaleString(),
        patients: removeFirstArray,
      };

      return patientsTodaysData;
    });

    patientData.then(async (data) => {
      data.patients.map(async (patient) => {
        await addPatientsData({
          date: data.date,
          data: patient,
          arrTime: '',
          duration: '',
          room: '',
          status: '',
          kiosk: {},
        });
      });
    });
    getAllPatientsData();
  };

  const getData = () => {
    fileRef.current.click();
  };

  React.useEffect(() => {}, []);

  const filteredByMonthAndYear = (selectedMonthAndYear) => {
    const filteredData = patientsInfo.filter((item) => {
      const segment = item.date.split('/');
      const month = months[segment[1] - 1];
      const year = segment[2];
      const MonthAndYear = `${month} ${year}`;

      return MonthAndYear === filteredBy || selectedMonthAndYear;
    });

    setFilteredData(filteredData);
  };

  const removeData = async (info) => {
    info.patients.map(async (patient) => {
      const response = await removeAllPatientsData(patient.id);
      if (response) {
        setPatientsInfo([]);
        setFilteredData([]);
      }
    });
  };

  React.useEffect(() => {
    filteredByMonthAndYear();
  }, [filteredBy, initialData]);

  React.useEffect(() => {
    if (initialData) {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, []);

  return (
    <section className={styles._wrapper}>
      <Container maxWidth='xl'>
        <input
          type='file'
          hidden
          accept='.xlsx,.xls'
          ref={fileRef}
          onChange={uploadFile}
        />

        <Box className={styles._box}>
          <Box>
            <h1>Upload Your Patients Information</h1>

            <Box
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '1rem',
                justifyContent: 'flex-start',
              }}>
              <p
                style={{
                  marginTop: '0.5rem',
                }}>
                Filtered By Month:
              </p>

              <FormControl
                style={{
                  flex: '1 1 auto',
                  backgroundColor: 'inherit',
                }}>
                <Select
                  disabled={patientsInfo.length === 0}
                  labelId='demo-simple-select-helper-label'
                  id='demo-simple-select-helper'
                  value={filteredBy}
                  label={filteredBy}
                  onChange={(e) => setFilteredBy(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #000000',
                    padding: '0 0.5rem',
                    backgroundColor: 'inherit',
                  }}>
                  {listOfMonthWithYear.map((month, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={month}
                        style={{
                          backgroundColor: 'inherit',
                        }}
                        onClick={() => filteredByMonthAndYear(month)}>
                        {month}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <AddBtn
            title='Import file'
            makeStyle={{
              whiteSpace: 'nowrap',
              width: '170px',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}
            handleClick={getData}
          />
        </Box>

        <Box
          style={{
            marginTop: '2rem',
          }}>
          {loading && (
            <Box sx={{ marginLeft: '38%' }}>
              <LineWave
                height='300'
                width='300'
                color='#212155'
                ariaLabel='line-wave'
                wrapperStyle={{}}
                wrapperClass=''
                visible={true}
                firstLineColor=''
                middleLineColor=''
                lastLineColor=''
              />
            </Box>
          )}
          {!patientsInfo && !loading && (
            <h1
              style={{
                textAlign: 'center',
                marginTop: '5rem',
              }}>
              <FaIcons.FaExclamationTriangle
                style={{
                  color: '#F7C110',
                  fontSize: '2rem',
                }}
              />{' '}
              No information available
            </h1>
          )}

          <Grid container spacing={3}>
            {patientsInfo &&
              !loading &&
              filteredData.map((item, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Info index={index} item={item} removeData={removeData} />
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Container>
    </section>
  );
};

export default PatientsInfo;

const Info = ({ item, removeData, index }) => {
  const [hovered, setHovered] = React.useState(false);
  const slug = item.date?.split('/').join('-').split(' ').join('&');

  return (
    <Box
      style={{
        position: 'relative',
      }}>
      <Box className={styles._icon_box}>
        <MdIcons.MdCancel
          onClick={() => removeData(item)}
          className={styles._icon}
          title='Remove'
        />
      </Box>
      <Link to={`/admin/patients/${slug}`} className={styles.hovered}>
        <Box
          className={`${styles._box} ${styles._data_box}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
          {hovered ? (
            <h3>
              <FaIcons.FaEye /> View
            </h3>
          ) : (
            <>
              <h3>{item.date?.split(', ')[0]}</h3>
              <p style={{ color: 'blue' }}>{item.patients?.length}</p>
            </>
          )}
        </Box>
      </Link>
    </Box>
  );
};
