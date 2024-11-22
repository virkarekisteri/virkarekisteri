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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextField,
  Typography,
  TablePagination,
} from '@mui/material';
import type { Position } from 'models/Position';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column } from 'react-table';
import { useTable, useSortBy } from 'react-table';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchPosition, selectPositionData } from 'redux/slices/position-slice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DataTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const dataFromBackend = useAppSelector(selectPositionData);
  const { t } = useTranslation();
  const [vacancyNumberSearch, setVacancyNumberSearch] = useState('');
  const [placementLocationStateSearch, setPlacementLocationSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState(dataFromBackend);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setFilteredData(dataFromBackend);
  }, [dataFromBackend]);

  const columns: Column<Position>[] = React.useMemo<Column<Position>[]>(
    () => [
      {
        Header: t('table.vacancy_number'),
        accessor: 'vacancyNumber',
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
    [t],
  );
  const handleRowClick = async (row: Position) => {
    if (row.id) {
      setSelectedRowId(row.id);
      await dispatch(fetchPosition(row.id));
    }
  };

  const handleSearch = () => {
    const filtered = dataFromBackend.filter((position) => {
      if (position) {
        const matchesVakanssinumero = vacancyNumberSearch
          ? (position.vacancyNumber?.includes(vacancyNumberSearch) ?? false)
          : true;
        const matchesSijoituspaikka = placementLocationStateSearch
          ? (position?.placementLocation?.includes(placementLocationStateSearch) ?? false)
          : true;
        return matchesVakanssinumero && matchesSijoituspaikka;
      }
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setVacancyNumberSearch('');
    setPlacementLocationSearch('');
    setFilteredData(dataFromBackend);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Position>(
    { columns, data: filteredData },
    useSortBy,
  );
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: alpha('#223B7C', 1), color: 'white' }}>
          <Typography sx={{ color: 'white' }}>{t('search_filter.search_filters')}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label={t('table.vacancy_number')}
              value={vacancyNumberSearch}
              onChange={(e) => setVacancyNumberSearch(e.target.value)}
              fullWidth
            />
            <TextField
              label={t('table.placement_location')}
              value={placementLocationStateSearch}
              onChange={(e) => setPlacementLocationSearch(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleSearch}>
              {t('search_filter.search')}
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              {t('search_filter.reset')}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
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
            {paginatedRows.map((row, index) => {
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
      <Box display="flex" justifyContent="center" mt={2}>
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('table.rows_per_page')}
        />
      </Box>
    </>
  );
};

export default DataTable;
