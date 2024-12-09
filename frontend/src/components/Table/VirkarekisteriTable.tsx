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
  Grid2,
  FormControl,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import type { Position } from 'models/Position';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Column } from 'react-table';
import { useTable, useSortBy } from 'react-table';
import { useAppDispatch } from 'redux/hooks';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetPositionsQuery, useLazyGetPositionQuery } from 'redux/api-slices/functions/positions-api';
import { useGetOrganizationTreesQuery } from 'redux/api-slices/functions/organization-trees-api';
import { clearSelectedPosition, selectPosition } from 'redux/slices/position-slice';

const DataTable: React.FC = () => {
  const dispatch = useAppDispatch();

  const { data: positions = [] } = useGetPositionsQuery();
  const { data: organizationTrees } = useGetOrganizationTreesQuery();
  const [getPosition] = useLazyGetPositionQuery();

  const { t } = useTranslation();
  const [vacancyNumberSearch, setVacancyNumberSearch] = useState('');
  const [placementLocationStateSearch, setPlacementLocationStateSearch] = useState('');
  const [positionNameSearch, setPositionNameSearch] = useState('');
  const [positionTypeSearch, setPositionTypeSearch] = useState<string[]>([]);
  const [vacancyStatusSearch, setVacancyStatusSearch] = useState<string[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Position[]>([]);
  const [filteredData, setFilteredData] = useState(positions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setFilteredData(positions);
  }, [positions]);

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
          const orgTree = organizationTrees?.find((tree) => tree.id === value);
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
    setSelectedRows((prev) => {
      const isAlreadySelected = prev.some((selected) => selected.id === row.id);
      const updatedSelectedRows = isAlreadySelected
        ? prev.filter((selected) => selected.id !== row.id)
        : [...prev, row];
      if (updatedSelectedRows.length === 0) {
        console.log('Ei yhtään riviä valittuna.');
        setSelectedRowId(null);
        dispatch(clearSelectedPosition());
      } else {
        console.log(
          'Valitut rivit:',
          updatedSelectedRows.map((r) => r.id), // Nämä pitää viedä eteenpäin ja käsitellä ->
        );
        setSelectedRowId(row.id || null);
        if (row.id) {
          getPosition(row.id, true);
          dispatch(selectPosition(row.id));
        }
      }
      return updatedSelectedRows;
    });
  };

  const handleSearch = () => {
    const filtered = positions.filter((position) => {
      if (position) {
        const matchesVakanssinumero = vacancyNumberSearch
          ? (position.vacancyNumber?.toLocaleLowerCase().includes(vacancyNumberSearch.toLocaleLowerCase()) ?? false)
          : true;
        const matchesSijoituspaikka = placementLocationStateSearch
          ? (position?.placementLocation
              ?.toLocaleLowerCase()
              .includes(placementLocationStateSearch.toLocaleLowerCase()) ?? false)
          : true;
        const matchesPositionName = positionNameSearch
          ? (position?.positionName?.name.includes(positionNameSearch) ?? false)
          : true;
        const matchesPositionType =
          positionTypeSearch.length > 0 ? positionTypeSearch.includes(position.type.toString()) : true;
        const matchesVacancyStatus =
          vacancyStatusSearch.length > 0 ? vacancyStatusSearch.includes(position.vacancyStatus.toString()) : true;
        return (
          matchesVakanssinumero &&
          matchesSijoituspaikka &&
          matchesPositionName &&
          matchesPositionType &&
          matchesVacancyStatus
        );
      }
    });
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setVacancyNumberSearch('');
    setPlacementLocationStateSearch('');
    setPositionNameSearch('');
    setPositionTypeSearch([]);
    setVacancyStatusSearch([]);
    setFilteredData(positions);
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  const handleVacancyStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVacancyStatusSearch((prev: string[]) =>
      prev.includes(value) ? prev.filter((status) => status !== value) : ([...prev, value] as string[]),
    );
  };

  const handlePositionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPositionTypeSearch((prev: string[]) =>
      prev.includes(value) ? prev.filter((status) => status !== value) : ([...prev, value] as string[]),
    );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Position>(
    { columns, data: filteredData },
    useSortBy,
  );
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <>
      <Box
        sx={{
          width: '950px',
          marginLeft: 0,
          marginRight: 'auto',
        }}
      >
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              backgroundColor: alpha('#223B7C', 1),
              color: 'white',
              minHeight: '45px',
              height: '45px',
              '&.Mui-expanded': {
                minHeight: '45px',
                height: '45px',
              },
              '& .MuiAccordionSummary-content': {
                margin: 0,
              },
            }}
          >
            <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>{t('search_filter.search_filters')}</Typography>
          </AccordionSummary>

          <AccordionDetails
            sx={{
              padding: '16px',
              backgroundColor: alpha('#f5f5f5', 1),
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  <TextField
                    label={t('table.vacancy_number')}
                    value={vacancyNumberSearch}
                    onChange={(e) => setVacancyNumberSearch(e.target.value)}
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    label={t('table.placement_location')}
                    value={placementLocationStateSearch}
                    onChange={(e) => setPlacementLocationStateSearch(e.target.value)}
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    label={t('table.position_name')}
                    value={positionNameSearch}
                    onChange={(e) => setPositionNameSearch(e.target.value)}
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={3}>
                  <Typography component={'div'} fontWeight={'fontWeightBold'}>
                    {t('table.type')}
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={positionTypeSearch.includes('1')}
                            onChange={handlePositionTypeChange}
                            value="1"
                          />
                        }
                        label={t('search_filter.virka')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={positionTypeSearch.includes('2')}
                            onChange={handlePositionTypeChange}
                            value="2"
                          />
                        }
                        label={t('search_filter.toimi')}
                      />
                    </FormGroup>
                  </FormControl>
                </Grid2>
                <Grid2 size={3}>
                  <Typography component={'div'} fontWeight={'fontWeightBold'}>
                    {t('table.vacancy_status')}
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={vacancyStatusSearch.includes('0')}
                            onChange={handleVacancyStatusChange}
                            value="0"
                          />
                        }
                        label={t('vacancy_statuses.abolished')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={vacancyStatusSearch.includes('1')}
                            onChange={handleVacancyStatusChange}
                            value="1"
                          />
                        }
                        label={t('vacancy_statuses.established')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={vacancyStatusSearch.includes('2')}
                            onChange={handleVacancyStatusChange}
                            value="2"
                          />
                        }
                        label={t('vacancy_statuses.active')}
                      />
                    </FormGroup>
                  </FormControl>
                </Grid2>
              </Grid2>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    fontSize: '0.8rem',
                    padding: '6px 35px',
                  }}
                >
                  {t('search_filter.search')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{
                    fontSize: '0.8rem',
                    padding: '6px 35px',
                  }}
                >
                  {t('search_filter.reset')}
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box sx={{ mt: 2 }}>
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
              {paginatedRows.map((row, index) => {
                prepareRow(row);
                return (
                  <TableRow
                    {...row.getRowProps()}
                    sx={{
                      backgroundColor: selectedRows.some((r) => r.id === row.original.id)
                        ? alpha('#223B7C', 0.5)
                        : index % 2 === 0
                          ? '#F9F9F9'
                          : alpha('#223B7C', 0.2),
                      cursor: 'pointer',
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
                <TableCell colSpan={columns.length} sx={{ backgroundColor: '#223B7C', textAlign: 'right' }}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
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
