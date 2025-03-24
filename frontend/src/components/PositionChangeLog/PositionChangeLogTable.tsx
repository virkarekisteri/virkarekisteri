import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  CircularProgress,
  alpha,
  Typography,
  TablePagination,
  TextField,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { PositionChangeLogEntry } from 'models/PositionChangeLogEntry';
import { useTranslation } from 'react-i18next';
import { formatTimestamp, getVacancyNumber } from './utils';
import { useGetPositionsQuery } from 'redux/api-slices/functions/positions-api';
import { useGetChangeLogsQuery } from 'redux/api-slices/functions/positionchangelogs-api';

const PositionChangeLogTable = () => {
  const { t } = useTranslation();

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filteredChangeLogs, setFilteredChangeLogs] = useState<PositionChangeLogEntry[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PositionChangeLogEntry; direction: 'asc' | 'desc' } | null>(
    null,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchVacancyNumber, setSearchVacancyNumber] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const { data: positions = [], isLoading: positionsLoading } = useGetPositionsQuery();
  const { data: positionchangeLogs = [], isLoading: changeLogsLoading } = useGetChangeLogsQuery();

  const isLoading = positionsLoading || changeLogsLoading;

  useEffect(() => {
    setFilteredChangeLogs(positionchangeLogs);
  }, [positionchangeLogs]);

  const getTranslatedField = (field: string) => {
    return t(`change_logs.fields.${field}`, field);
  };

  // Sorting logic
  const handleSort = (key: keyof PositionChangeLogEntry) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedChangeLogs = React.useMemo(() => {
    if (!sortConfig) return filteredChangeLogs;

    return [...filteredChangeLogs].sort((a, b) => {
      const aValue = a[sortConfig.key] as string;
      const bValue = b[sortConfig.key] as string;

      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }, [filteredChangeLogs, sortConfig]);

  // Pagination logic
  const paginatedChangeLogs = sortedChangeLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search logic
  const handleSearch = () => {
    const filtered = positionchangeLogs.filter((log) => {
      const matchesVacancyNumber = searchVacancyNumber
        ? getVacancyNumber(log.positionId, positions).includes(searchVacancyNumber)
        : true;
      const matchesDate = searchDate ? formatTimestamp(log.timestamp).includes(searchDate) : true;
      return matchesVacancyNumber && matchesDate;
    });
    setFilteredChangeLogs(filtered);
    setPage(0);
  };

  const handleResetSearch = () => {
    setSearchVacancyNumber('');
    setSearchDate('');
    setFilteredChangeLogs(positionchangeLogs);
    setPage(0);
  };

  const handleRowToggle = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  const mapTypeValue = (value: string) => {
    if (value === '1') {
      return t('position_type.position');
    } else if (value === '2') {
      return t('position_type.post');
    }
    return value;
  };

  const transformToPercentage = (value: string | number | null) => {
    if (value === null || value === undefined) {
      return '-';
    }
    const numericValue = typeof value === 'number' ? value : parseFloat(value.replace(',', '.'));
    if (!isNaN(numericValue)) {
      return (numericValue * 100).toFixed(0); // Convert to percentage and fix to 0 decimal places
    }
    return value.toString();
  };

  const transformValue = (field: string, value: string | null) => {
    if ((field === 'VacancyFill' || field === 'VacancySize') && value) {
      return transformToPercentage(value);
    }
    return value;
  };

  return (
    <Box>
      {/* Search Controls */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label={t('change_logs.search.byNumber')}
          value={searchVacancyNumber}
          onChange={(e) => setSearchVacancyNumber(e.target.value)}
        />
        <TextField
          label={t('change_logs.search.byDate')}
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          {t('search_filter.search')}
        </Button>
        <Button variant="outlined" onClick={handleResetSearch}>
          {t('search_filter.reset')}
        </Button>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {/* Table Header */}
          <TableHead sx={{ backgroundColor: '#223B7C', height: '30px' }}>
            <TableRow>
              <TableCell
                sx={{
                  color: 'white',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '8px 16px',
                }}
                onClick={() => handleSort('timestamp')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('change_logs.table.timestamp')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'timestamp' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '8px 16px',
                }}
                onClick={() => handleSort('positionId')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('change_logs.table.vacancy_number')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'positionId' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '8px 16px',
                }}
                onClick={() => handleSort('editedField')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('change_logs.table.edited_field')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'editedField' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '8px 16px',
                }}
                onClick={() => handleSort('decisionNumber')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('change_logs.table.decision_number')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'decisionNumber' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                  </Box>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '8px 16px',
                }}
                onClick={() => handleSort('editor')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('change_logs.table.editor')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'editor' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {paginatedChangeLogs.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  sx={{
                    backgroundColor: paginatedChangeLogs.indexOf(row) % 2 === 0 ? '#F9F9F9' : alpha('#223B7C', 0.2),
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRowToggle(row.id)}
                >
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>
                    <Box display="flex" alignItems="center">
                      <IconButton size="small" sx={{ ml: 1 }}>
                        {expandedRow === row.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                      {formatTimestamp(row.timestamp)}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>
                    {getVacancyNumber(row.positionId, positions)}
                  </TableCell>
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{getTranslatedField(row.editedField)}</TableCell>
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.decisionNumber}</TableCell>
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.editor}</TableCell>
                </TableRow>

                {/* Expanded Row */}
                {expandedRow === row.id && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ padding: '16px', backgroundColor: '#F0F0F0' }}>
                      <Typography fontWeight="bold" sx={{ mb: 2 }}>
                        {t('change_logs.table.change')}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" paddingX={5}>
                        <Box sx={{ flex: 1, textAlign: 'left', paddingRight: 2 }}>
                          <Typography fontWeight="bold">{t('change_logs.table.old_value')}</Typography>
                          <Typography>
                            {row.editedField === 'Type'
                              ? mapTypeValue(row.oldValue)
                              : (transformValue(row.editedField, row.oldValue) ?? '-')}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, textAlign: 'left', paddingLeft: 2 }}>
                          <Typography fontWeight="bold">{t('change_logs.table.new_value')}</Typography>
                          <Typography>
                            {row.editedField === 'Type'
                              ? mapTypeValue(row.newValue)
                              : (transformValue(row.editedField, row.newValue) ?? '-')}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <TablePagination
          component="div"
          count={sortedChangeLogs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('table.rows_per_page')}
        />
      </Box>
    </Box>
  );
};

export default PositionChangeLogTable;
