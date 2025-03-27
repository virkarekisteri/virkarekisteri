import * as React from 'react';
import { useEffect, useState } from 'react';
import type { SelectChangeEvent } from '@mui/material';
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
  InputLabel,
  Select,
  Chip,
  MenuItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { GridDensity, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { Position } from 'models/Position';
import type { PositionEmployee } from 'models/PositionEmployee';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'redux/hooks';
import { useGetPositionsQuery, useLazyGetPositionQuery } from 'redux/api-slices/functions/positions-api';
import { useGetCostCentersQuery } from 'redux/api-slices/functions/organization-trees-api';
import { useLazyGetPositionEmployeeQuery } from 'redux/api-slices/functions/position-employees-api';
import { clearSelectedPosition, selectPosition } from 'redux/slices/position-slice';
import { format } from 'date-fns';
import type { OrganizationTree } from 'models/OrganizationTree';
import { useGetSubjectsQuery } from 'redux/api-slices/functions/subjects';

interface DataTableProps {
  onRowSelectionChange: (selectedRows: Position[]) => void;
}

interface CustomData {
  replacement?: PositionEmployee;
  employee?: PositionEmployee;
}

// Käsittelee päivämäärät
const parseDate = (dateStr: string): number => {
  if (dateStr.includes('.')) {
    const [day, month, year] = dateStr.split('.');
    return new Date(+year, +month - 1, +day).setHours(0, 0, 0, 0);
  }
  return new Date(dateStr).setHours(0, 0, 0, 0);
};

const DataTable: React.FC<DataTableProps> = ({ onRowSelectionChange }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Hae data API-kutsuilla
  const { data: positions = [] } = useGetPositionsQuery();
  const { data: organizationTrees } = useGetCostCentersQuery();
  const [getPosition] = useLazyGetPositionQuery();
  const [lazyEmployeeTrigger] = useLazyGetPositionEmployeeQuery();
  const { data: subjects = [] } = useGetSubjectsQuery();

  // Filteröi aktiiviset aineet
  const activeSubjectNames = subjects
    .filter((subject) => subject.active === true)
    .map((subject) => subject.subjectName);

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
  const [teacherPositionSearch, setTeacherPositionSearch] = useState(false);
  const [teacherSubjectSearch, setTeacherSubjectSearch] = useState<string[]>([]);

  // Näytettävä data ja sivutus
  const [filteredData, setFilteredData] = useState<Position[]>(positions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(() => {
    const stored = localStorage.getItem('dataGridRowsPerPage');
    return stored ? parseInt(stored, 10) : 10;
  });
  const [enrichedPositions, setEnrichedPositions] = useState<Position[]>([]);

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
    async function enrichPositionsData() {
      setLoading(true);
      // Haetaan kaikki viranhaltijan ja mahdollisen sijaisen tiedot Promise.allilla.
      const fetchedEmployees: (CustomData | null)[] = await Promise.all(
        positions
          .filter((position) => position?.positionEmployeeId)
          .map(async (position) => {
            const customData: CustomData = {};
            const employee = await lazyEmployeeTrigger(position?.positionEmployeeId ?? '', true);
            const replacementEmployee =
              employee.data?.inLeave && (await lazyEmployeeTrigger(position?.replacementEmployeeId ?? '', true));
            if (replacementEmployee) {
              customData.replacement = replacementEmployee.data ?? undefined;
            }
            customData.employee = employee.data ?? undefined;
            return customData;
          }),
      );

      // Rikastetaan jokainen position lisäämällä muunnetut kentät
      const positionsEnriched = positions.map((pos) => {
        const custom = fetchedEmployees.find((cd: CustomData | null) => cd?.employee?.id === pos.positionEmployeeId);

        return {
          ...pos,
          employeeName: custom?.employee?.employeeName || '',
          employeeStartDate: custom?.employee?.startDate
            ? format(new Date(custom.employee.startDate), 'dd.MM.yyyy')
            : '',
          employeeEndDate: custom?.employee?.endingDate
            ? format(new Date(custom.employee.endingDate), 'dd.MM.yyyy')
            : '',
          replacementName: custom?.replacement?.employeeName || '',
          replacementStartDate: custom?.replacement?.startDate
            ? format(new Date(custom.replacement.startDate), 'dd.MM.yyyy')
            : '',
          replacementEndDate: custom?.replacement?.endingDate
            ? format(new Date(custom.replacement.endingDate), 'dd.MM.yyyy')
            : '',
        };
      });
      // Tallennetaan rikastettu data omaan tilaan ja alustetaan filteredData sillä
      setEnrichedPositions(positionsEnriched);
      setFilteredData(positionsEnriched);
      setLoading(false);
    }

    if (positions.length > 0) {
      enrichPositionsData();
    }
  }, [positions, lazyEmployeeTrigger]);

  const handleSearch = () => {
    setLoading(true);

    const filtered = enrichedPositions.filter((position) => {
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

      const orgTreeElement = organizationTrees?.find((tree) => tree.id === position.costcentreId);
      const fullTreeWord = orgTreeElement ? (orgTreeElement.number + ' ' + orgTreeElement.name).toLowerCase() : '';
      const matchesOrganizationTree = organizationTreeSearch
        ? fullTreeWord.includes(organizationTreeSearch.toLowerCase())
        : true;

      const matchesPositionType =
        positionTypeSearch.length > 0 ? positionTypeSearch.includes(position.type.toString()) : true;

      const matchesVacancyStatus =
        vacancyStatusSearch.length > 0 ? vacancyStatusSearch.includes(position.vacancyStatus.toString()) : true;

      const matchesTeacherPosition = teacherPositionSearch ? position.isTeacher === true : true;

      const matchesTeacherSubject =
        !teacherSubjectSearch || teacherSubjectSearch.length === 0
          ? true
          : position.subjectIds?.some((subjectId) => {
              const subject = subjects.find((s) => s.id === subjectId);
              return subject && teacherSubjectSearch.includes(subject.subjectName);
            }) || false;

      let matchesStartDateBegin = true;

      // Tarkistetaan onko virkaan asettamisen alkamispäivällä haettu
      if (startDateBeginsSearch) {
        if (!position.employeeStartDate && !position.replacementStartDate) {
          matchesStartDateBegin = false;
        }
        // Tarkistetaan onko viranhaltijalla sekä sijaisella haettu
        else if (employeeNameSearch && position.employeeName && replacementNameSearch && position.replacementName) {
          // Jos viranhaltijan ja sijaisen alkamisaika on pienempi kuin haku, niin ei oteta mukaan eli false...
          if (
            position.employeeStartDate &&
            position.replacementStartDate &&
            parseDate(position.employeeStartDate) < parseDate(startDateBeginsSearch) &&
            parseDate(position.replacementStartDate) < parseDate(startDateBeginsSearch)
          ) {
            matchesStartDateBegin = false;
          }
        }
        // Haetaan vain viranhaltijalla, jos pienempi alkamisaika kuin haku, annetaan false
        else if (employeeNameSearch && position.employeeName && position.employeeStartDate) {
          if (parseDate(position.employeeStartDate) < parseDate(startDateBeginsSearch)) {
            matchesStartDateBegin = false;
          }
        }
        // Haetaan vain sijaisella, jos pienempi alkamisaika kuin haku, annetaan false
        else if (replacementNameSearch && position.replacementName && position.replacementStartDate) {
          if (parseDate(position.replacementStartDate) < parseDate(startDateBeginsSearch)) {
            matchesStartDateBegin = false;
          }
        }
        // Haetaan vain alkamisajalla ja tarkistettava item on viranhaltija
        else if (position.employeeName && position.employeeStartDate) {
          if (parseDate(position.employeeStartDate) < parseDate(startDateBeginsSearch)) {
            matchesStartDateBegin = false;
          }
        }
        // Haetaan vain alkamisajalla ja tarkistettava item on sijainen
        else if (position.replacementName && position.replacementStartDate) {
          if (parseDate(position.replacementStartDate) < parseDate(startDateBeginsSearch)) {
            matchesStartDateBegin = false;
          }
        }
      }

      // Sama kuin yllä, mutta katsotaan virkaan asettamispäivää päättyen
      let matchesStartDateEnding = true;
      if (startDateEndsSearch) {
        if (!position.employeeEndDate && !position.replacementEndDate) {
          matchesStartDateEnding = false;
        } else if (employeeNameSearch && position.employeeName && replacementNameSearch && position.replacementName) {
          if (
            position.employeeEndDate &&
            position.replacementEndDate &&
            parseDate(position.employeeEndDate) > parseDate(startDateEndsSearch) &&
            parseDate(position.replacementEndDate) > parseDate(startDateEndsSearch)
          ) {
            matchesStartDateEnding = false;
          }
        } else if (employeeNameSearch && position.employeeName && position.employeeEndDate) {
          if (parseDate(position.employeeEndDate) > parseDate(startDateEndsSearch)) {
            matchesStartDateEnding = false;
          }
        } else if (replacementNameSearch && position.replacementName && position.replacementEndDate) {
          if (parseDate(position.replacementEndDate) > parseDate(startDateEndsSearch)) {
            matchesStartDateEnding = false;
          }
        } else if (position.employeeName && position.employeeEndDate) {
          if (parseDate(position.employeeEndDate) > parseDate(startDateEndsSearch)) {
            matchesStartDateEnding = false;
          }
        } else if (position.replacementName && position.replacementEndDate) {
          if (parseDate(position.replacementEndDate) > parseDate(startDateEndsSearch)) {
            matchesStartDateEnding = false;
          }
        }
      }

      const matchesEmployeeName = employeeNameSearch
        ? position.employeeName
          ? position.employeeName.toLowerCase().includes(employeeNameSearch.toLowerCase())
          : false
        : true;

      const matchesReplacementName = replacementNameSearch
        ? position.replacementName
          ? position.replacementName.toLowerCase().includes(replacementNameSearch.toLowerCase())
          : false
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
        matchesReplacementName &&
        matchesTeacherPosition &&
        matchesTeacherSubject
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
    setTeacherSubjectSearch([]);
    setEmployeeNameSearch('');
    setReplacementNameSearch('');
    setPositionTypeSearch([]);
    setVacancyStatusSearch([]);
    setTeacherPositionSearch(false);
    setFilteredData(enrichedPositions);
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

  const handleTeacherPositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherPositionSearch(event.target.checked);
    if (!event.target.checked) {
      setTeacherSubjectSearch([]);
    }
  };

  const handleTeacherSubjectChange = (event: SelectChangeEvent<typeof teacherSubjectSearch>) => {
    const { value } = event.target;
    setTeacherSubjectSearch(typeof value === 'string' ? value.split(',') : value);
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
      valueGetter: (params: { name: string }) => params.name || 'Error',
    },
    {
      field: 'costcentreId',
      headerName: t('table.organization_tree'),
      flex: 1,
      sortable: true,
      valueGetter: (params: any) => {
        const id = params;
        if (!id || !organizationTrees) return id;
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
      valueFormatter: (params: number) => {
        const value: number = params;
        let statusText = '';
        switch (value) {
          case 2:
            statusText = t('vacancy_statuses.active');
            break;
          case 1:
            statusText = t('vacancy_statuses.established');
            break;
          case 0:
            statusText = t('vacancy_statuses.abolished');
            break;
          default:
            break;
        }
        return statusText;
      },
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
      field: 'employeeName',
      headerName: t('table.employee_name'),
      flex: 1,
      sortable: true,
    },
    {
      field: 'employeeStartDate',
      headerName: t('table.start_date'),
      flex: 1,
      sortable: true,
      valueFormatter: (params: string) => params || '',
    },
    {
      field: 'employeeEndDate',
      headerName: t('employee.ending_date'),
      flex: 1,
      sortable: true,
      valueFormatter: (params: string) => params || '',
    },
    {
      field: 'replacementName',
      headerName: t('employee.replacement_name'),
      flex: 1,
      sortable: true,
      valueFormatter: (params: string) => params || '',
    },
    {
      field: 'replacementStartDate',
      headerName: t('employee.replacement_start_date'),
      flex: 1,
      sortable: true,
      valueFormatter: (params: string) => params || '',
    },
    {
      field: 'replacementEndDate',
      headerName: t('employee.replacement_end_date'),
      flex: 1,
      sortable: true,
      valueFormatter: (params: string) => params || '',
    },
    {
      field: 'type',
      headerName: t('table.type'),
      flex: 1,
      sortable: true,
      valueFormatter: (params: number) => {
        switch (params) {
          case 1:
            return 'Virka';
          case 2:
            return 'Toimi';
          default:
            return params;
        }
      },
    },
    {
      field: 'creationDecisionNumber',
      headerName: t('table.creation_decision_number'),
      flex: 1,
      sortable: true,
    },
    {
      field: 'isTeacher',
      headerName: t('table.teacher'),
      flex: 1,
      sortable: true,
      valueFormatter: (params: boolean) => (params ? t('table.yes') : t('table.no')),
    },
    {
      field: 'subjectIds',
      headerName: t('table.subjects'),
      flex: 1,
      sortable: true,
      valueGetter: (params: string[]) => {
        const ids = params;
        if (!ids || !subjects) return '';
        const subjectNames = ids
          .map((id) => subjects.find((subject) => subject.id === id))
          .map((subject) => subject?.subjectName);
        return subjectNames ? subjectNames.join(', ') : '';
      },
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
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
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
              {teacherPositionSearch && (
                <Grid2 size={4}>
                  <FormControl fullWidth>
                    <InputLabel shrink={true} id="subjects">{`${t('create_position.subjects')}`}</InputLabel>
                    <Select
                      labelId="subjects"
                      multiple
                      value={teacherSubjectSearch}
                      onChange={handleTeacherSubjectChange}
                      renderValue={(selected) => (
                        <div>
                          {selected.map((subject) => (
                            <Chip key={subject} label={subject} sx={{ marginRight: 1, maxHeight: 20 }} />
                          ))}
                        </div>
                      )}
                      label={t('create_position.subjects')}
                      displayEmpty
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 400,
                          },
                        },
                      }}
                    >
                      {activeSubjectNames.sort().map((subject) => (
                        <MenuItem key={subject} value={subject}>
                          <Checkbox checked={teacherSubjectSearch.includes(subject)} />
                          <ListItemText primary={subject} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid2>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
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
              <Grid2 size={2.7}>
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
              <Grid2 size={4}>
                <Typography component="div" fontWeight="bold">
                  {t('table.other')}
                </Typography>
                <FormControlLabel
                  control={<Checkbox checked={teacherPositionSearch} onChange={handleTeacherPositionChange} />}
                  label={t('table.teacher')}
                />
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
          getRowId={(row: Position) => row.id ?? row.costcentreId ?? 'unknown'}
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
            const newSelectedRows = filteredData.filter((row) => selection.includes(row.id ?? row.costcentreId!));
            setSelectedRows(newSelectedRows);
            onRowSelectionChange(newSelectedRows);

            if (newSelectedRows.length > 0) {
              const lastSelectedRow = newSelectedRows[newSelectedRows.length - 1];
              const rowId = lastSelectedRow.id ?? lastSelectedRow.costcentreId;
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
