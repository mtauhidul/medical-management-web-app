import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
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
import EditDialog from './EditDataDialog';

const DateTable = ({ files }) => {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState('paper');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editableData, setEditableData] = React.useState({});

  const handleClickOpen = (scrollType, data) => () => {
    setOpen(true);
    setScroll(scrollType);
    setEditableData(data);
  };

  const handleClose = () => {
    setOpen(false);
    setEditableData({});
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper>
      <EditDialog
        open={open}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        scroll={scroll}
        editableData={editableData && editableData}
        setEditableData={setEditableData}
      />

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  whiteSpace: 'nowrap',
                }}
                align='center'>
                Action
              </TableCell>

              {files.map((column) => {
                return (
                  <React.Fragment key={column.id}>
                    {Object.entries(column?.others)
                      .sort()
                      .map((key, value) => {
                        return (
                          <TableCell
                            key={value}
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: key[1]?.priority ? 'bold' : 'normal',
                            }}
                            align='center'>
                            {key[1]?.name}
                          </TableCell>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {files
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={i}>
                    <TableCell
                      style={{
                        whiteSpace: 'nowrap',
                      }}
                      align='center'>
                      <IconButton onClick={handleClickOpen('paper', row)}>
                        <FaIcons.FaEdit
                          style={{
                            fontSize: '1.2rem',
                          }}
                        />
                      </IconButton>
                    </TableCell>

                    {Object.entries(row?.others)
                      .sort()
                      .map((key, value) => {
                        return (
                          <TableCell
                            key={value}
                            style={{
                              whiteSpace: 'nowrap',
                            }}
                            align='center'>
                            {key[1]?.value}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                );
              })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={5}
                count={files.length}
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
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={files.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
};

export default DateTable;
