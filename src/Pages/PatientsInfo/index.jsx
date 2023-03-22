import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import toast from 'react-hot-toast';
import readXlsxFile from 'read-excel-file';
import AddBtn from '../../Components/Buttons/AddBtn/AddBtn';

import { addPatientsData, removePatientsData } from '../../API/Api';
import { usePatientInformationContext } from '../../context/PatientsInformationContext';
import ConditionalRendering from './ConditionalRendering';
import FilteredPatientsData from './FilteredPatientsData';
import Info from './Info';
import styles from './PatientsInfo.module.scss';

const PatientsInfo = ({ patientsData }) => {
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
  const [loading, setLoading] = React.useState(true);
  const [day, setDay] = React.useState(new Date().getDate());
  const [filteredByDay, setFilteredByDay] = React.useState(false);

  React.useEffect(() => {
    if (patientsData.length > 0) {
      const fData = patientsData.filter((item) => {
        const segment = item.date.split('/');
        const month = months[segment[1] - 1];
        const year = segment[2];
        const MonthAndYear = `${month} ${year}`;

        return MonthAndYear === filteredBy;
      });

      fData.sort((a, b) => (a.date > b.date ? 1 : -1));

      setFilteredData(fData);
      setDay(new Date().getDate());
      setFilteredByDay(false);
      setLoading(false);
    }
  }, [patientsData, filteredBy]);

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
      data.patients.map(async (patient, index) => {
        const lastIndex = 0;

        await addPatientsData(
          {
            date: data.date,
            data: patient,
            arrTime: '',
            duration: '',
            room: '',
            status: '',
            kiosk: {},
          },
          index,
          lastIndex
        );
      });
    });
  };

  const getData = () => {
    fileRef.current.click();
  };

  const filteredByDate = (date) => {
    setFilteredByDay(true);
    const filteredData = patientsInfo.filter((info) => {
      return info.date.split('/')[0] === date;
    });
    setFilteredData(filteredData);
  };

  const removeData = async (info) => {
    info.patients.map(async (patient) => {
      await removePatientsData(patient.id);
    });
  };

  return (
    <section className={styles._wrapper}>
      <Container maxWidth='xl'>
        <input
          type='file'
          hidden
          accept='.xlsx'
          ref={fileRef}
          onChange={uploadFile}
        />

        <Box className={styles._box}>
          <Box>
            <h1>Upload Your Patients Information</h1>

            <FilteredPatientsData
              filteredByDay={filteredByDay}
              day={day}
              setDay={setDay}
              patientsInfo={patientsInfo}
              filteredByDate={filteredByDate}
              filteredBy={filteredBy}
              setFilteredBy={setFilteredBy}
            />
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
          <ConditionalRendering
            loading={loading}
            patientsInfo={patientsInfo}
            filteredData={filteredData}
          />

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
