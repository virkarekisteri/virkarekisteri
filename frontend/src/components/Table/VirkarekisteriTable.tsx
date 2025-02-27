import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  Typography,
  Grid2,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  alpha,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { GridDensity, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { Position } from 'models/Position';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'redux/hooks';
import { useGetPositionsQuery, useLazyGetPositionQuery } from 'redux/api-slices/functions/positions-api';
import { useGetOrganizationTreesQuery } from 'redux/api-slices/functions/organization-trees-api';
import { useLazyGetPositionEmployeeQuery } from 'redux/api-slices/functions/position-employees-api';
import { clearSelectedPosition, selectPosition } from 'redux/slices/position-slice';
import { useGetPositionEmployeeQuery } from 'redux/api-slices/functions/position-employees-api';
import { skipToken } from '@reduxjs/toolkit/query';
import { format } from 'date-fns';
import type { OrganizationTree } from 'models/OrganizationTree';

/* eslint-disable react/prop-types */

interface DataTableProps {
  onRowSelectionChange: (selectedRows: Position[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({ onRowSelectionChange }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Hae data API-kutsuilla
  const { data: positions = [] } = useGetPositionsQuery();
  const { data: organizationTrees } = useGetOrganizationTreesQuery();
  const [getPosition] = useLazyGetPositionQuery();
  const [lazyEmployeeTrigger] = useLazyGetPositionEmployeeQuery();

  // Suodatuskentät (Hakusuodattimet)
  const [vacancyNumberSearch, setVacancyNumberSearch] = useState('');
  const [placementLocationStateSearch, setPlacementLocationStateSearch] = useState('');
  const [positionNameSearch, setPositionNameSearch] = useState('');
  const [decisionNumberSearch, setDecisionNumberSearch] = useState('');
  const [organizationTreeSearch, setOrganizationTreeSearch] = useState('');
  const [startDateBeginsSearch, setStartDateBeginsSearch] = useState('');
  const [startDateEndsSearch, setStartDateEndsSearch] = useState('');
  const [employeeNameSearch, setEmployeeNameSearch] = useState('');
  const [replacementNameSearch, setReplacementNameSearch] = useState('');
  const [positionTypeSearch, setPositionTypeSearch] = useState<string[]>([]);
  const [vacancyStatusSearch, setVacancyStatusSearch] = useState<string[]>([]);

  // Näytettävä data ja sivutus
  const [filteredData, setFilteredData] = useState<Position[]>(positions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(() => {
    const stored = localStorage.getItem('dataGridRowsPerPage');
    return stored ? parseInt(stored, 10) : 10;
  });

  // Valitut rivit
  const [, setSelectedRows] = useState<Position[]>([]);

  // Density vaihtoehdot ja localStorageen
  const [density, setDensity] = React.useState<GridDensity>(() => {
    const stored = localStorage.getItem('dataGridDensity');
    return (stored as GridDensity) || 'standard';
  });

  // Tallennetaan sarakkeiden näkyvyys localStorageen
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
    const stored = localStorage.getItem('columnVisibilityModel');
    return stored ? JSON.parse(stored) : {};
  });

  // Density localStorageen kun muuttuu
  useEffect(() => {
    localStorage.setItem('dataGridDensity', density);
  }, [density]);

  // Rows per page localStorageen kun muuttuu
  useEffect(() => {
    localStorage.setItem('dataGridRowsPerPage', rowsPerPage.toString());
  }, [rowsPerPage]);

  useEffect(() => {
    setFilteredData(positions);
  }, [positions]);

  // Viranhaltijan nimi solukko - näytölle
  const EmployeeNameCell: React.FC<GridRenderCellParams<Position>> = (params) => {
    const { data: employee } = useGetPositionEmployeeQuery(params.row.positionEmployeeId ?? skipToken);
    return <>{employee ? employee.employeeName : ''}</>;
  };

  // Sijaisen nimi solukko - näytölle
  const ReplacementNameCell: React.FC<GridRenderCellParams<Position>> = (params) => {
    const { data: employee } = useGetPositionEmployeeQuery(params.row.replacementEmployeeId ?? skipToken);
    return <>{employee && employee.replacement ? employee.employeeName : ''}</>;
  };

  // Virkaan asettamispäivä solukko - näytölle
  const StartDateCell: React.FC<{ row: Position }> = ({ row }) => {
    const { data: employee } = useGetPositionEmployeeQuery(row.positionEmployeeId ?? skipToken);
    if (!employee || !employee.startDate) return <></>;
    return <>{format(new Date(employee.startDate), 'dd.MM.yyyy')}</>;
  };

  // Sijaisuuden alkamispäivä solukko - näytölle
  const ReplacementStartDateCell: React.FC<{ row: Position }> = ({ row }) => {
    const { data: employee } = useGetPositionEmployeeQuery(row.replacementEmployeeId ?? skipToken);
    if (!employee || !employee.startDate) return <></>;
    return <>{format(new Date(employee.startDate), 'dd.MM.yyyy')}</>;
  };

  const handleSearch = async () => {
    setLoading(true);
    const fetchedEmployees = await Promise.all(
      positions
        .filter((position) => position?.positionEmployeeId)
        .map(async (position) => {
          // Haetaan viranhaltijan ja sijaisen tiedot rinnakkain
          const customData: { replacement: any; employee: any } = { replacement: {}, employee: {} };
          const employee = await lazyEmployeeTrigger(position?.positionEmployeeId ?? '', true);
          const replacementEmployee =
            employee.data?.inLeave && (await lazyEmployeeTrigger(position?.replacementEmployeeId ?? '', true));
          replacementEmployee ? (customData.replacement = replacementEmployee.data) : '';
          customData.employee = employee.data;
          return customData ?? null;
        }),
    ).then((data) => {
      setLoading(false);
      return data;
    });

    const filtered = positions.filter((position) => {
      if (!position) return false;

      const matchesVacancyNumber = vacancyNumberSearch
        ? position.vacancyNumber?.toLowerCase().includes(vacancyNumberSearch.toLowerCase())
        : true;

      const matchesPlacementLocation = placementLocationStateSearch
        ? position.placementLocation?.toLowerCase().includes(placementLocationStateSearch.toLowerCase())
        : true;

      const matchesPositionName = positionNameSearch
        ? position.positionName?.name.toLowerCase().includes(positionNameSearch.toLowerCase())
        : true;

      const matchesDecisionNumber = decisionNumberSearch
        ? position.creationDecisionNumber?.toLowerCase().includes(decisionNumberSearch.toLowerCase())
        : true;

      const orgTreeElement = organizationTrees?.find((tree) => tree.id === position.orgTreeId);
      const fullTreeWord = orgTreeElement ? (orgTreeElement.number + ' ' + orgTreeElement.name).toLowerCase() : '';
      const matchesOrganizationTree = organizationTreeSearch
        ? fullTreeWord.includes(organizationTreeSearch.toLowerCase())
        : true;

      const matchesPositionType =
        positionTypeSearch.length > 0 ? positionTypeSearch.includes(position.type.toString()) : true;

      const matchesVacancyStatus =
        vacancyStatusSearch.length > 0 ? vacancyStatusSearch.includes(position.vacancyStatus.toString()) : true;

      const employeeData = fetchedEmployees.find(
        (emp) => emp.employee && emp.employee.id === position.positionEmployeeId,
      );
      const replacementData = fetchedEmployees.find(
        (rep) => rep.replacement && rep.replacement.id === position.replacementEmployeeId,
      );

      const matchesStartDateBegin = startDateBeginsSearch
        ? employeeNameSearch && employeeData && replacementNameSearch && replacementData
          ? new Date(employeeData.employee.startDate).setHours(0, 0, 0, 0) >=
              new Date(startDateBeginsSearch).setHours(0, 0, 0, 0) &&
            new Date(replacementData.replacement.startDate).setHours(0, 0, 0, 0) >=
              new Date(startDateBeginsSearch).setHours(0, 0, 0, 0)
          : employeeNameSearch && employeeData
            ? new Date(employeeData.employee.startDate).setHours(0, 0, 0, 0) >=
              new Date(startDateBeginsSearch).setHours(0, 0, 0, 0)
            : replacementNameSearch && replacementData
              ? new Date(replacementData.replacement.startDate).setHours(0, 0, 0, 0) >=
                new Date(startDateBeginsSearch).setHours(0, 0, 0, 0)
              : employeeData || replacementData
                ? new Date(employeeData?.employee.startDate).setHours(0, 0, 0, 0) >=
                    new Date(startDateBeginsSearch).setHours(0, 0, 0, 0) ||
                  new Date(replacementData?.replacement.startDate).setHours(0, 0, 0, 0) >=
                    new Date(startDateBeginsSearch).setHours(0, 0, 0, 0)
                : false
        : true;

      const matchesStartDateEnding = startDateEndsSearch
        ? employeeNameSearch && employeeData && replacementNameSearch && replacementData
          ? new Date(employeeData.employee.startDate).setHours(0, 0, 0, 0) <=
              new Date(startDateEndsSearch).setHours(0, 0, 0, 0) &&
            new Date(replacementData.replacement.startDate).setHours(0, 0, 0, 0) <=
              new Date(startDateEndsSearch).setHours(0, 0, 0, 0)
          : employeeNameSearch && employeeData
            ? new Date(employeeData.employee.startDate).setHours(0, 0, 0, 0) <=
              new Date(startDateEndsSearch).setHours(0, 0, 0, 0)
            : replacementNameSearch && replacementData
              ? new Date(replacementData.replacement.startDate).setHours(0, 0, 0, 0) <=
                new Date(startDateEndsSearch).setHours(0, 0, 0, 0)
              : employeeData || replacementData
                ? new Date(employeeData?.employee.startDate).setHours(0, 0, 0, 0) <=
                    new Date(startDateEndsSearch).setHours(0, 0, 0, 0) ||
                  new Date(replacementData?.replacement.startDate).setHours(0, 0, 0, 0) <=
                    new Date(startDateEndsSearch).setHours(0, 0, 0, 0)
                : false
        : true;

      const matchesEmployeeName = employeeNameSearch
        ? employeeData &&
          employeeData.employee &&
          employeeData.employee.employeeName.toLowerCase().includes(employeeNameSearch.toLowerCase())
        : true;

      const matchesReplacementName = replacementNameSearch
        ? replacementData &&
          replacementData.replacement &&
          replacementData.replacement.employeeName.toLowerCase().includes(replacementNameSearch.toLowerCase())
        : true;

      return (
        matchesVacancyNumber &&
        matchesPlacementLocation &&
        matchesPositionName &&
        matchesDecisionNumber &&
        matchesOrganizationTree &&
        matchesPositionType &&
        matchesVacancyStatus &&
        matchesStartDateBegin &&
        matchesStartDateEnding &&
        matchesEmployeeName &&
        matchesReplacementName
      );
    });
    setFilteredData(filtered);
    setPage(0);
    setLoading(false);
  };

  const handleReset = () => {
    setVacancyNumberSearch('');
    setPlacementLocationStateSearch('');
    setPositionNameSearch('');
    setDecisionNumberSearch('');
    setOrganizationTreeSearch('');
    setStartDateBeginsSearch('');
    setStartDateEndsSearch('');
    setEmployeeNameSearch('');
    setReplacementNameSearch('');
    setPositionTypeSearch([]);
    setVacancyStatusSearch([]);
    setFilteredData(positions);
    setPage(0);
  };

  const handleVacancyStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVacancyStatusSearch((prev) =>
      prev.includes(value) ? prev.filter((status) => status !== value) : [...prev, value],
    );
  };

  const handlePositionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPositionTypeSearch((prev) => (prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value]));
  };

  // Määritellään DataGridin sarakkeet
  const columns = [
    {
      field: 'vacancyNumber',
      headerName: t('table.vacancy_number'),
      flex: 1,
      sortable: true,
    },
    {
      field: 'positionName',
      headerName: t('table.position_name'),
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams<Position>) => {
        if (!params.row) return '';
        const pos = params.row.positionName;
        return pos && typeof pos === 'object' ? pos.name || '' : pos || '';
      },
    },
    {
      field: 'orgTreeId',
      headerName: t('table.organization_tree'),
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams<Position>) => {
        const id = params.row?.orgTreeId;
        if (!id || !organizationTrees) return '';
        const orgTree = organizationTrees.find((tree: OrganizationTree) => tree.id === id);
        return orgTree ? `${orgTree.number} ${orgTree.name}` : '';
      },
    },
    {
      field: 'placementLocation',
      headerName: t('table.placement_location'),
      flex: 1,
      sortable: true,
    },
    {
      field: 'vacancyStatus',
      headerName: t('table.vacancy_status'),
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams<Position>) => {
        const value = params.value;
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
          default:
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
    {
      field: 'positionEmployeeId',
      headerName: t('table.employee_name'),
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams<Position>) => <EmployeeNameCell {...params} />,
    },
    {
      field: 'positionReplacementId',
      headerName: t('employee.replacement_name'),
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams<Position>) => <ReplacementNameCell {...params} />,
    },
    {
      field: 'creationDecisionNumber',
      headerName: t('table.creation_decision_number'),
      flex: 1,
      sortable: true,
    },
    {
      field: 'start_date',
      headerName: t('employee.start_date'),
      flex: 1,
      sortable: true,
      renderCell: (params: GridRenderCellParams<Position>) => <StartDateCell row={params.row} />,
    },
    {
      field: 'replacement_start_date',
      headerName: t('employee.replacement_start_date'),
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Position>) => <ReplacementStartDateCell row={params.row} />,
    },
  ];

  return (
    <>
      {/* Hakusuodattimet Accordion-komponentissa */}
      <Box sx={{ width: '950px', marginLeft: 0, marginRight: 'auto' }}>
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
              '&.Mui-expanded': { minHeight: '45px', height: '45px' },
              '& .MuiAccordionSummary-content': { margin: 0 },
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              {t('search_filter.search_filters')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: '16px', backgroundColor: alpha('#f5f5f5', 1) }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Grid2 size={4}>
                <TextField
                  label={t('table.vacancy_number')}
                  value={vacancyNumberSearch}
                  onChange={(e) => setVacancyNumberSearch(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  label={t('table.placement_location')}
                  value={placementLocationStateSearch}
                  onChange={(e) => setPlacementLocationStateSearch(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  label={t('table.position_name')}
                  value={positionNameSearch}
                  onChange={(e) => setPositionNameSearch(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  label={t('table.creation_decision_number')}
                  value={decisionNumberSearch}
                  onChange={(e) => setDecisionNumberSearch(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  label={t('employee.start_date_begins')}
                  type="date"
                  value={startDateBeginsSearch}
                  onChange={(e) => setStartDateBeginsSearch(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  label={t('employee.start_date_ends')}
                  type="date"
                  value={startDateEndsSearch}
                  onChange={(e) => setStartDateEndsSearch(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  label={t('table.organization_tree')}
                  value={organizationTreeSearch}
                  onChange={(e) => setOrganizationTreeSearch(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  label={t('employee.employee_name')}
                  value={employeeNameSearch}
                  onChange={(e) => setEmployeeNameSearch(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  label={t('employee.replacement_name')}
                  value={replacementNameSearch}
                  onChange={(e) => setReplacementNameSearch(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid2>
              <Grid2 size={2}>
                <Typography component="div" fontWeight="bold">
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
              <Grid2 size={2}>
                <Typography component="div" fontWeight="bold">
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
              <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto', alignItems: 'center' }}>
                <Button variant="contained" onClick={handleSearch} sx={{ fontSize: '0.8rem', padding: '6px 40px' }}>
                  {t('search_filter.search')}
                </Button>
                <Button variant="outlined" onClick={handleReset} sx={{ fontSize: '0.8rem', padding: '6px 40px' }}>
                  {t('search_filter.reset')}
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* DataGrid-komponentti */}
      <Box sx={{ mt: 2, width: '100%', height: 'auto' }}>
        <DataGrid
          loading={loading}
          rows={filteredData}
          columns={columns}
          density={density}
          onDensityChange={(newDensity) => setDensity(newDensity)}
          getRowId={(row: Position) => row.id ?? row.orgTreeId ?? 'unknown'}
          pagination
          paginationModel={{ page, pageSize: rowsPerPage }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setRowsPerPage(model.pageSize);
          }}
          pageSizeOptions={[10, 30, 50, 100, 300, 500, 1000]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => {
            const selection = newSelection as string[];
            const newSelectedRows = filteredData.filter((row) => selection.includes(row.id ?? row.orgTreeId!));
            setSelectedRows(newSelectedRows);
            onRowSelectionChange(newSelectedRows);

            if (newSelectedRows.length > 0) {
              const lastSelectedRow = newSelectedRows[newSelectedRows.length - 1];
              const rowId = lastSelectedRow.id ?? lastSelectedRow.orgTreeId;
              if (rowId) {
                getPosition(rowId, true);
                dispatch(selectPosition(rowId));
              }
            } else {
              dispatch(clearSelectedPosition());
            }
          }}
          rowCount={filteredData.length}
          paginationMode="client"
          disableColumnFilter
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => {
            setColumnVisibilityModel(newModel);
            localStorage.setItem('columnVisibilityModel', JSON.stringify(newModel));
          }}
          slotProps={{
            toolbar: {
              csvOptions: {
                fileName: 'Virkarekisteri_data_table',
                delimiter: ';',
                utf8WithBom: true,
              },
              printOptions: {
                hideFooter: true,
                hideToolbar: true,
                includeCheckboxes: false,
                pageStyle: `
          @page {
            size: landscape;
            margin: 10mm;
          }
          @media print {
            .MuiDataGrid-root {
              transform: scale(0.7);
              transform-origin: top left;
            }
          }
        `,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </>
  );
};

export default DataTable;
