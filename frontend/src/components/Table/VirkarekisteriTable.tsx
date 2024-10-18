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
import { format } from 'date-fns';
import type { Position } from 'models/Position';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column } from 'react-table';
import { useTable, useSortBy } from 'react-table';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchPosition, selectPositionData } from 'redux/slices/position-slice';
const DataTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataFromBackend = useAppSelector(selectPositionData);
  const { t } = useTranslation();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const columns: Column<Position>[] = React.useMemo<Column<Position>[]>(
    () => [
      {
        Header: t('table.created_at'),
        accessor: 'createdAt',
        Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy'),
      },
      {
        Header: t('table.creation_decision_number'),
        accessor: 'creationDecisionNumber',
      },
      {
        Header: t('table.vacancy_size'),
        accessor: 'vacancySize',
      },
      {
        Header: t('table.type'),
        accessor: 'type',
      },
    ],
    [t],
  );
  const handleRowClick = async (row: Position) => {
    if (row.id) {
      setSelectedRowId(row.id);
      await dispatch(fetchPosition(row.id));
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Position>(
    { columns, data: dataFromBackend },
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
                  backgroundColor:
                    row.original.id === selectedRowId
                      ? alpha('#223B7C', 0.5)
                      : index % 2 === 0
                        ? '#FFFFFF'
                        : alpha('#223B7C', 0.2),
                  cursor: 'pointer',
                }}
                onClick={() => handleRowClick(row.original)}
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
