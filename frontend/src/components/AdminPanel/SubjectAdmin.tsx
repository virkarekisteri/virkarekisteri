import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  alpha,
  TablePagination,
  TextField,
  Button,
  Grid2,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { TeacherSubject } from 'models/TeacherSubject';
import { useGetTeacherSubjectsQuery } from 'redux/api-slices/functions/teachersubject-api';
import SubjectDetails from 'components/Details/SubjectDetails';
import { RequiresEditRole } from 'components/role-guards';
import EditSubjectModal from 'components/Modal/EditSubjectModal';

import ActivityLight from 'components/Components/ActivityLight';

const SubjectAdmin = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || 'fi';

  const [expandedRow, setExpandedRow] = useState<TeacherSubject | null>(null);
  const [filteredSubjects, setFilteredTeacherSubjects] = useState<TeacherSubject[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TeacherSubject; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchSubjectName, setSearchSubjectName] = useState('');
  const [showOnlyActiveSubjects, setShowOnlyActiveSubjects] = useState<boolean>(false);

  const { data: teacherSubjects = [], isLoading: teacherSubjectsLoading } = useGetTeacherSubjectsQuery();

  const isLoading = teacherSubjectsLoading;

  useEffect(() => {
    if (teacherSubjects.length > 0) {
      const sortedByName = [...teacherSubjects].sort((a, b) => {
        return a.subjectName.localeCompare(b.subjectName, locale);
      });
      setFilteredTeacherSubjects(sortedByName);
    } else {
      setFilteredTeacherSubjects([]);
    }
  }, [teacherSubjects]);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleToggleOnlyActiveSubjects = () => {
    setShowOnlyActiveSubjects(!showOnlyActiveSubjects);
  };

  const handleSort = (key: keyof TeacherSubject) => {
    setSortConfig((prevConfig) => {
      setPage(0);
      if (!prevConfig || prevConfig.key !== key) {
        return { key, direction: 'asc' };
      }

      if (prevConfig.direction === 'asc') {
        return { key, direction: 'desc' };
      }

      return null;
    });
  };

  /* Sorting logic */
  const sortedTeacherSubjects = React.useMemo(() => {
    if (!sortConfig) return filteredSubjects;

    // sorting by active/inactive
    if (sortConfig.key == 'active') {
      return [...filteredSubjects].sort((a, b) => {
        const aActive = a[sortConfig.key] as boolean;
        const bActive = b[sortConfig.key] as boolean;

        if (aActive === bActive) {
          // secondary sort by name, ascending
          const aName = a['subjectName'] as string;
          const bName = b['subjectName'] as string;

          return aName.localeCompare(bName, locale);
        } else {
          // primary sort by active/inactive
          if (sortConfig.direction == 'asc') return aActive ? 1 : -1;
          else return aActive ? -1 : 1;
        }
      });
    }

    return [...filteredSubjects].sort((a, b) => {
      const aValue = a[sortConfig.key] as string;
      const bValue = b[sortConfig.key] as string;

      return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue, locale) : bValue.localeCompare(aValue, locale);
    });
  }, [filteredSubjects, sortConfig]);

  // Pagination logic
  const paginatedTeacherSubjects = sortedTeacherSubjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    setExpandedRow(null);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search logic
  const handleSearch = () => {
    const filtered = teacherSubjects.filter((s) => {
      const matchesName = searchSubjectName 
        ? s['subjectName'].toLowerCase().includes(searchSubjectName.toLowerCase()) 
        : true;
      const matchesActive = showOnlyActiveSubjects ? s.active === true : true;
      return matchesName && matchesActive;
    });
    setFilteredTeacherSubjects(filtered);
    setPage(0);
  };

  const handleResetSearch = () => {
    setSearchSubjectName('');
    setShowOnlyActiveSubjects(false);
    setFilteredTeacherSubjects(teacherSubjects);
    setPage(0);
  };

  const handleRowToggle = (subject: TeacherSubject) => {
    setExpandedRow(expandedRow && expandedRow.id === subject.id ? null : subject);
  };

  const handleCloseDetails = () => {
    setExpandedRow(null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={2}>
        {/* Search Controls */}
        <Box display="flex" flexWrap="wrap" gap={2}>
          <Box display="flex" gap={2}>
            {/* Search by  name */}
            <TextField
              label={t('admin_panel.search.byName')}
              value={searchSubjectName}
              onChange={(e) => setSearchSubjectName(e.target.value)}
              sx={{ minWidth: '300px' }}
            />

            {/* Search only active */}
            <FormControlLabel
              control={
                <Checkbox checked={Boolean(showOnlyActiveSubjects)} onChange={() => handleToggleOnlyActiveSubjects()} />
              }
              label={t('admin_panel.teacher_subjects.show_only_active')}
              sx={{ minWidth: '250px' }}
            />
          </Box>

          {/* Search and clear buttons */}
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" onClick={handleSearch}>
              {t('search_filter.search')}
            </Button>

            <Button variant="outlined" onClick={handleResetSearch}>
              {t('search_filter.reset')}
            </Button>
          </Box>
        </Box>

        <RequiresEditRole>
          <Button
            variant="contained"
            onClick={handleOpenCreateModal}
            sx={{
              backgroundColor: '#223B7C',
              color: 'white',
              fontSize: '1.0rem',
              padding: '20px',
              height: '40px',
              display: 'flex',
              borderRadius: '25px 8px 8px 25px',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
            startIcon={
              <Box
                component="span"
                sx={{
                  marginRight: '8px',
                }}
              >
                +
              </Box>
            }
          >
            {t('admin_panel.teacher_subjects.create_subject')}
          </Button>
        </RequiresEditRole>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {/* Table Header */}
          <TableHead sx={{ backgroundColor: '#223B7C', height: '30px' }}>
            <TableRow>
              <TableCell
                sx={{
                  width: '60%',
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
                    backgroundColor:
                      row === expandedRow
                        ? alpha('#223B7C', 0.5)
                        : paginatedTeacherSubjects.indexOf(row) % 2 === 0
                          ? '#F9F9F9'
                          : alpha('#223B7C', 0.2),
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRowToggle(row)}
                >
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.subjectName}</TableCell>
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>
                    <ActivityLight
                      value={row.active}
                      labeltrue={t('admin_panel.teacher_subjects.active')}
                      labelfalse={t('admin_panel.teacher_subjects.inactive')}
                    />
                  </TableCell>
                </TableRow>
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

      <Grid2>
        <Grid2 size={12}>
          {expandedRow ? (
            <SubjectDetails
              position={expandedRow}
              doneEditingCallback={handleCloseDetails}
              allSubjects={sortedTeacherSubjects}
            />
          ) : null}
        </Grid2>
      </Grid2>
      <EditSubjectModal
        open={createModalOpen}
        handleClose={handleCloseCreateModal}
        submitCallback={() => {
          handleCloseDetails();
          handleCloseCreateModal();
        }}
        position={undefined}
        allSubjects={sortedTeacherSubjects}
      />
      {/*
       */}
    </Box>
  );
};

export default SubjectAdmin;
