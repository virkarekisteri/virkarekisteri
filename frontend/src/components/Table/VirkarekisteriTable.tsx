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
  CircularProgress,
} from '@mui/material';
import type { Position } from 'models/Position';
import moment from 'moment';
import React from 'react';
import type { Column } from 'react-table';
import { useTable, useSortBy } from 'react-table';
import { useAppSelector } from 'redux/hooks';
import type { RootState } from 'redux/store';

const DataTable: React.FC = () => {
  const dataFromBackend = useAppSelector((state: RootState) => state.positions.entries);
  const dataLoading = useAppSelector((state: RootState) => state.positions.loading);

  const columns: Column<Position>[] = React.useMemo<Column<Position>[]>(
    () => [
      {
        Header: 'Luomispäivämäärä',
        accessor: 'createdAt',
        Cell: ({ value }) => moment(value).format('DD.MM.YYYY'),
      },
      {
        Header: 'Luomispäätöksen numero',
        accessor: 'creationDecisionNumber',
      },
      {
        Header: 'Vakanssikoko',
        accessor: 'vacancySize',
      },
      {
        Header: 'Laji',
        accessor: 'type',
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Position>(
    { columns, data: dataFromBackend },
    useSortBy,
  );

  return (
    <TableContainer component={Box} sx={{ margin: 2, border: '1px solid #ccc' }}>
      {dataLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
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
      )}
    </TableContainer>
  );
};

export default DataTable;
