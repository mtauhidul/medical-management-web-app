import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import * as React from 'react';
import data from '../../../Assets/data';

export default function MyTable({ files }) {
  console.log(files);
  return (
    <TableContainer component={Paper}>
      <Table style={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            {data &&
              data.length > 0 &&
              Object.entries(data[0]).map((key) => {
                return (
                  <TableCell
                    key={key}
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      fontWeight: key[1].priority ? 'bold' : 'normal',
                    }}>
                    {key[0]?.split('_').join(' ')}
                  </TableCell>
                );
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.name}
              style={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {Object.keys(row).map((key) => (
                <TableCell
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                  key={key}>
                  {row[key]?.value || row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
