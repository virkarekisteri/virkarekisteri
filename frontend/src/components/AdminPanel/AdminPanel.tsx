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
import { useTranslation } from 'react-i18next';
import type { TeacherSubject } from 'models/TeacherSubject';
import { useGetTeacherSubjectsQuery } from 'redux/api-slices/functions/teachersubject-api';

const AdminPanel = () => {
  const { t } = useTranslation();

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filteredSubjects, setFilteredTeacherSubjects] = useState<TeacherSubject[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TeacherSubject; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchSubjectName, setSearchSubjectName] = useState('');

  const { data: teacherSubjects = [], isLoading: teacherSubjectsLoading } = useGetTeacherSubjectsQuery();

  const isLoading = /* positionsLoading || */ teacherSubjectsLoading;

  useEffect(() => {
    setFilteredTeacherSubjects(teacherSubjects);
  }, [teacherSubjects]);

  /*
  const getTranslatedField = (field: string) => {
    return t(`change_logs.fields.${field}`, field);
  };
  */

  // Sorting logic
  const handleSort = (key: keyof TeacherSubject) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedTeacherSubjects = React.useMemo(() => {
    if (!sortConfig) return filteredSubjects;

    if (sortConfig.key == 'active') {
      return [...filteredSubjects].sort((a, b) => {
        const aActive = a[sortConfig.key] as boolean;
        const bActive = b[sortConfig.key] as boolean;

        if (aActive === bActive) {
          // secondary sort by name  
          const aName = a['subjectName'] as string;
          const bName = b['subjectName'] as string;

          return sortConfig.direction === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
        } else {
          // primary sort by active/inactive
        }

        if (sortConfig.direction == 'asc') return aActive ? 1 : -1;
        else return aActive ? -1 : 1;
      })
    }

    return [...filteredSubjects].sort((a, b) => {
      const aValue = a[sortConfig.key] as string;
      const bValue = b[sortConfig.key] as string;

      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
  }, [filteredSubjects, sortConfig]);

  // Pagination logic
  const paginatedTeacherSubjects = sortedTeacherSubjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search logic
  const handleSearch = () => {
    const filtered = teacherSubjects.filter((s) => {
      const matchesVacancyNumber = searchSubjectName
        ? s['subjectName'].includes(searchSubjectName)
        : true;
      //const matchesDate = searchDate ? formatTimestamp(log.timestamp).includes(searchDate) : true;
      return matchesVacancyNumber;// && matchesDate;
    });
    setFilteredTeacherSubjects(filtered);
    setPage(0);
  };

  const handleResetSearch = () => {
    setSearchSubjectName('');
    setFilteredTeacherSubjects(teacherSubjects);
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
          label={t('admin_panel.search.bySubjectName')}
          value={searchSubjectName}
          onChange={(e) => setSearchSubjectName(e.target.value)}
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
                onClick={() => handleSort('subjectName')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('admin_panel.teacher_subjects.name')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'subjectName' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
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
                onClick={() => handleSort('active')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('admin_panel.teacher_subjects.status')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'active' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {paginatedTeacherSubjects.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  sx={{
                    backgroundColor: paginatedTeacherSubjects.indexOf(row) % 2 === 0 ? '#F9F9F9' : alpha('#223B7C', 0.2),
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRowToggle(row.id)}
                >

                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.subjectName}</TableCell>
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.active}</TableCell>
                </TableRow>

                {/* Expanded Row */}
                {/* 
                {expandedRow === row.Id && (
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
                */}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <TablePagination
          component="div"
          count={sortedTeacherSubjects.length}
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

export default AdminPanel;
