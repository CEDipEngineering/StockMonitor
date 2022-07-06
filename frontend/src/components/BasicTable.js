import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

/*
'name':s.name,
'key':s.key,
'amount':str(s.amount),
'investment':str(s.investment),
'purchasePrice':str(s.purchasePrice)
*/
export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Stocks </TableCell>
            <TableCell align="right">Key</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Investment&nbsp;(R$)</TableCell>
            <TableCell align="right">Price At Purchase&nbsp;(R$/pt)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell align="right">{row.key}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
              <TableCell align="right">{row.investment}</TableCell>
              <TableCell align="right">{row.purchasePrice}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}