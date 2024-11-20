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
import type { Position } from 'models/Position';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column } from 'react-table';
import { useTable, useSortBy } from 'react-table';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchPosition, selectPositionData } from 'redux/slices/position-slice';
import { selectOrganizationTreeData, getOrganizationTrees } from 'redux/slices/organization-tree-slice';

const DataTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataFromBackend = useAppSelector(selectPositionData);
  const { t } = useTranslation();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const organizationTrees = useAppSelector(selectOrganizationTreeData);

  useEffect(() => {
    if (!organizationTrees.length) {
      dispatch(getOrganizationTrees());
    }
  }, [dispatch, organizationTrees]);

  const columns: Column<Position>[] = React.useMemo<Column<Position>[]>(
    () => [
      {
        Header: t('table.vacancy_number'),
        accessor: 'vacancyNumber',
      },
      {
        Header: t('table.position_name'),
        accessor: 'positionName',
        Cell: ({ value }: { value: { name: string } }) => value?.name || '',
      },
      {
        Header: t('table.organization_tree'),
        accessor: 'orgTreeId',
        Cell: ({ value }: { value: string }) => {
          const orgTree = organizationTrees.find((tree) => tree.id === value);
          return orgTree ? `${orgTree.number} ${orgTree.name}` : '';
        },
      },
      {
        Header: t('table.placement_location'),
        accessor: 'placementLocation',
      },
      {
        Header: t('table.vacancy_status'),
        accessor: 'vacancyStatus',
        Cell: ({ value }: { value: number }) => {
          let statusText = '';
          let color = '';
          switch (value) {
            case 2:
              statusText = t('vacancy_statuses.active');
              color = 'green';
              break;
            case 1:
              statusText = t('vacancy_statuses.established');
              color = 'yellow';
              break;
            case 0:
              statusText = t('vacancy_statuses.abolished');
              color = 'red';
              break;
          }
          return (
            <Box display="flex" alignItems="center">
              <Box
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: color,
                  marginRight: 1,
                }}
              />
              {statusText}
            </Box>
          );
        },
      },
    ],
    [t, organizationTrees],
  );
  const handleRowClick = async (row: Position) => {
    if (row.id === selectedRowId) {
      setSelectedRowId(null); // Deselect row
    } else {
      setSelectedRowId(row.id ?? null); // Use null if row.id is undefined
      await dispatch(fetchPosition(row.id!)); // Assert row.id is defined for the dispatch
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Position>(
    { columns, data: dataFromBackend },
    useSortBy,
  );

  return (
    <TableContainer component={Box} sx={{ border: '0px solid #ccc' }}>
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
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    padding: '8px 16px',
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
                        ? '#F9F9F9'
                        : alpha('#223B7C', 0.1),
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: alpha('#223B7C', 0.3),
                  },
                }}
                onClick={() => handleRowClick(row.original)}
              >
                {row.cells.map((cell) => (
                  <TableCell {...cell.getCellProps()} sx={{ color: 'black', fontSize: '1rem' }}>
                    {cell.render('Cell')}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={columns.length}
              sx={{ backgroundColor: '#223B7C', color: 'white', fontSize: '1rem', padding: '10px 16px' }}
            >
              {t('table.total_rows')}: {rows.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
