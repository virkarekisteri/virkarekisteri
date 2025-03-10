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
  Grid2
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTranslation } from 'react-i18next';
import type { TeacherSubject } from 'models/TeacherSubject';
import { useGetTeacherSubjectsQuery } from 'redux/api-slices/functions/teachersubject-api';
import SubjectDetails from 'components/Details/SubjectDetails';
import { RequiresEditRole, RequiresAdminRole } from 'components/role-guards';
import EditSubjectModal from '../Modal/EditSubjectModal'

const AdminPanel = () => {
  const { t } = useTranslation();

  const [expandedRow, setExpandedRow] = useState<TeacherSubject | null>(null);
  const [filteredSubjects, setFilteredTeacherSubjects] = useState<TeacherSubject[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TeacherSubject; direction: 'asc' | 'desc' } | null>(null); // TODO: this should default to asc
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchSubjectName, setSearchSubjectName] = useState('');

  const { data: teacherSubjects = [], isLoading: teacherSubjectsLoading } = useGetTeacherSubjectsQuery();

  const isLoading = /* positionsLoading || */ teacherSubjectsLoading;

  useEffect(() => {
    setFilteredTeacherSubjects(teacherSubjects);
  }, [teacherSubjects]);


  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleOpenCreateModal = () => {
    console.log("open")
    setCreateModalOpen(true);
  };
  
  const handleCloseCreateModal = () => {
    console.log("close")
    setCreateModalOpen(false);
  };


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
    //console.log(sortConfig.direction)
    
    // sorting by active/inactive
    if (sortConfig.key == 'active') {
      return [...filteredSubjects].sort((a, b) => {
        const aActive = a[sortConfig.key] as boolean;
        const bActive = b[sortConfig.key] as boolean;

        if (aActive === bActive) {
          // secondary sort by name, ascending
          const aName = a['subjectName'] as string;
          const bName = b['subjectName'] as string;

          return aName.localeCompare(bName);

        } else {
          // primary sort by active/inactive
          if (sortConfig.direction == 'asc') return aActive ? 1 : -1;
          else return aActive ? -1 : 1;
        }

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

  const handleRowToggle = (subject: TeacherSubject) => {
    setExpandedRow(expandedRow && expandedRow.id === subject.id ? null : subject);
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
                  {t('new_position')}
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
                    backgroundColor: row === expandedRow ? alpha('#223B7C', 0.5) : (paginatedTeacherSubjects.indexOf(row) % 2 === 0 ? '#F9F9F9' : alpha('#223B7C', 0.2)),
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRowToggle(row)}
                >

                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.subjectName}</TableCell>
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.active ? t('admin_panel.teacher_subjects.active') : t('admin_panel.teacher_subjects.inactive')}</TableCell>
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
          {
            expandedRow ? <SubjectDetails position={expandedRow} allSubjects={sortedTeacherSubjects}/> : null
          }
          </Grid2>
        </Grid2>
        <EditSubjectModal open={createModalOpen} handleClose={handleCloseCreateModal} allSubjects={sortedTeacherSubjects}/>
        {/* 
 */}
    </Box>
  );
};

export default AdminPanel;
