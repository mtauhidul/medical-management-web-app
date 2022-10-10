import * as React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import IconButton from "@material-ui/core/IconButton";

import useMediaQuery from "@material-ui/core/useMediaQuery";

import styles from "./PatientsTable.module.scss";

const headerData = [
  "Appointment Date",
  "Appointment Start Time",
  "Visit Type",
  "Visit Status",
  "Case Label",
  "Patient Name",
  "Patient First Name",
  "Patient Last Name",
  "Appointment Facility Name",
  "Appointment Provider Name",
  "Resource Provider Name",
];

const PatientsTable = ({ patientData }) => {
  const desktop = useMediaQuery("(min-width: 1200px)");
  const tablet = useMediaQuery("(max-width:1200px)");
  const mobile = useMediaQuery("(max-width:600px)");
  const colSpan = desktop ? 6 : tablet ? 4 : mobile ? 2 : 5;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <section className={styles._wrapper}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table aria-label="sticky table">
          <TableHead className={styles._table_head}>
            <TableRow>
              {headerData.map((data, index) => (
                <TableCell
                  key={index}
                  style={{
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {patientData &&
              patientData?.patients
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {new Date(row[0]).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {new Date(row[1]).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {row[8]}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {row[9]}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {row[10]}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {row[13]}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {row[14]}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {row[15]}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {row[36]}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {row[41]}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                    >
                      {row[45]}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[7, 15, 25, { label: "All", value: -1 }]}
                colSpan={colSpan}
                count={patientData?.patients?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
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
