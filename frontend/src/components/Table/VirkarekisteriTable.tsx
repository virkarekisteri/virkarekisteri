/* eslint-disable react/jsx-key */
import {
  TableContainer,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  alpha,
} from '@mui/material';
import React from 'react';
import type { Column } from 'react-table';
import { useTable, useSortBy } from 'react-table';

// Define the data type
interface Data {
  virkanumero: string;
  viranHoitaja: string;
  kustannuspaikka: string;
  sijoituspaikka: string;
  virannimi?: string; // Optional field
}

const DataTable: React.FC = () => {
  const data: Data[] = React.useMemo(
    () => [
      {
        virkanumero: '12348',
        viranHoitaja: 'Jack Daniels',
        kustannuspaikka: 'Marketing',
        sijoituspaikka: 'Oulu',
        virannimi: 'Marketing Manager',
      },
      {
        virkanumero: '12345',
        viranHoitaja: 'John Doe',
        kustannuspaikka: 'Finance',
        sijoituspaikka: 'Helsinki',
        virannimi: 'Manager',
      },
      {
        virkanumero: '12346',
        viranHoitaja: 'Jane Doe',
        kustannuspaikka: 'HR',
        sijoituspaikka: 'Espoo',
        virannimi: 'Assistant Manager',
      },
      {
        virkanumero: '12347',
        viranHoitaja: 'Jim Beam',
        kustannuspaikka: 'IT',
        sijoituspaikka: 'Tampere',
        virannimi: 'Developer',
      },
      {
        virkanumero: '12348',
        viranHoitaja: 'Jack Daniels',
        kustannuspaikka: 'Marketing',
        sijoituspaikka: 'Oulu',
        virannimi: 'Marketing Manager',
      },
      {
        virkanumero: '12345',
        viranHoitaja: 'John Doe',
        kustannuspaikka: 'Finance',
        sijoituspaikka: 'Helsinki',
        virannimi: 'Manager',
      },
      {
        virkanumero: '12346',
        viranHoitaja: 'Jane Doe',
        kustannuspaikka: 'HR',
        sijoituspaikka: 'Espoo',
        virannimi: 'Assistant Manager',
      },
      {
        virkanumero: '12347',
        viranHoitaja: 'Jim Beam',
        kustannuspaikka: 'IT',
        sijoituspaikka: 'Tampere',
        virannimi: 'Developer',
      },
    ],
    [],
  );

  const columns: Column<Data>[] = React.useMemo<Column<Data>[]>(
    () => [
      {
        Header: 'Virkanumero',
        accessor: 'virkanumero',
      },
      {
        Header: 'Viran hoitaja',
        accessor: 'viranHoitaja',
      },
      {
        Header: 'Kustannuspaikka',
        accessor: 'kustannuspaikka',
      },
      {
        Header: 'Sijoituspaikka',
        accessor: 'sijoituspaikka',
      },
      {
        Header: 'Virannimi',
        accessor: 'virannimi',
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Data>(
    { columns, data },
    useSortBy,
  );

  return (
    <TableContainer component={Box} sx={{ margin: 2, border: '1px solid #ccc' }}>
      <Table {...getTableProps()} sx={{ minWidth: 650 }}>
        <TableHead sx={{ backgroundColor: '#223B7C', height: '30px' }}>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
              {headerGroup.headers.map((column: any) => (
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  {column.render('Header')}
                  <span style={{ marginLeft: '8px', display: 'inline-block', width: '16px', textAlign: 'center' }}>
                    {column.isSorted ? (column.isSortedDesc ? '🔽' : '🔼') : ' '}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : alpha('#223B7C', 0.2),
                }}
              >
                {row.cells.map((cell) => (
                  <TableCell {...cell.getCellProps()} sx={{ color: 'black' }}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ backgroundColor: '#223B7C', textAlign: 'right' }}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
