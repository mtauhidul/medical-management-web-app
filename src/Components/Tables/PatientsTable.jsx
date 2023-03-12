import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import * as React from 'react';
import * as FaIcons from 'react-icons/fa';

import useMediaQuery from '@material-ui/core/useMediaQuery';

import { deletePatientData, patientCheckIn } from '../../API/Api';
import { usePatientInformationContext } from '../../context/PatientsInformationContext';
import styles from './PatientsTable.module.scss';

const headerData = [
  'Actions',
  'Appointment Date',
  'Appointment Start Time',
  'Visit Type',
  'Visit Status',
  'Case Label',
  'Patient Name',
  'Patient First Name',
  'Patient Last Name',
  'Appointment Facility Name',
  'Appointment Provider Name',
  'Resource Provider Name',
  'Arr Time',
  'Duration',
  'Room',
  'Status',
];

const PatientsTable = ({ patientData }) => {
  const desktop = useMediaQuery('(min-width: 1200px)');
  const tablet = useMediaQuery('(max-width:1200px)');
  const mobile = useMediaQuery('(max-width:600px)');
  const colSpan = desktop ? 7 : tablet ? 4 : mobile ? 2 : 5;

  // console.log('==>', patientData.patients);

  const { setPatientsInfo } = usePatientInformationContext();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleCheckIn = async (idx) => {
    // Add confirm alert here before check in
    const opinion = window.confirm('Are you sure you want to check in?');

    if (opinion) {
      const getPatientData = await patientData.patients[idx];

      const neededData = {
        userInfo: {
          fullName: getPatientData.data[15] + ' ' + getPatientData.data[14],
        },
        demographicsInfo: {
          address: getPatientData.data[25],
          address2: getPatientData.data[25],
          city: getPatientData.data[22],
          state: getPatientData.data[23],
          zipcode: getPatientData.data[24],
          phone: getPatientData.data[28],
          email: getPatientData.data[31],
        },
        primaryInsurance: {
          insuranceName: getPatientData.data[53],
          memberId: getPatientData.data[54],
        },
      };

      await patientCheckIn(neededData, getPatientData.id);
    } else {
      return;
    }
  };

  const removeData = async (idx) => {
    const delStatus = await deletePatientData(idx);
    if (delStatus) {
      const getPatientData = patientData.patients[idx];

      const removePatientData = patientData.patients.filter(
        (patient) => patient !== getPatientData
      );

      const newPatientData = {
        date: patientData.date,
        patients: removePatientData,
      };

      setPatientsInfo((prevData) => {
        const removeOldData = prevData.filter((data) => data !== patientData);
        return [...removeOldData, newPatientData];
      });
    }
  };

  return (
    <section className={styles._wrapper}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table aria-label='sticky table'>
          <TableHead className={styles._table_head}>
            <TableRow>
              {headerData.map((data, index) => (
                <TableCell
                  key={index}
                  style={{
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}>
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {patientData &&
              patientData?.patients
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(
                  (row, index) => (
                    console.log({ row }),
                    (
                      <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                        <TableCell
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.1rem',
                          }}>
                          <IconButton onClick={() => handleCheckIn(index)}>
                            <FaIcons.FaSignInAlt
                              style={{
                                fontSize: '1.2rem',
                              }}
                            />
                          </IconButton>
                          <IconButton onClick={() => removeData(row.id)}>
                            <FaIcons.FaTrashAlt
                              style={{
                                fontSize: '1.2rem',
                              }}
                            />
                          </IconButton>
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {new Date(
                            row?.data[0].seconds * 1000
                          ).toLocaleDateString('en-US')}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {new Date(
                            row?.data[1].seconds * 1000
                          ).toLocaleTimeString('en-US') || '-'}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row?.data[8]}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row?.data[9]}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row?.data[10]}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row?.data[13]}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row?.data[14]}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row?.data[15]}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row?.data[36]}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row?.data[41]}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row?.data[45]}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row.arrTime
                            ? new Date(row.arrTime).toLocaleTimeString('en')
                            : '-'}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row.duration || '-'}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row.room || '-'}
                        </TableCell>
                        <TableCell
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                          align='center'>
                          {row.status || '-'}
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  20,
                  50,
                  { label: 'All', value: -1 },
                ]}
                colSpan={colSpan}
                count={patientData?.patients?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </section>
  );
};

export default PatientsTable;
