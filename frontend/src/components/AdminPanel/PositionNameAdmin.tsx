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

import type { PositionName } from 'models/PositionName';

import { useGetPositionNamesQuery } from 'redux/api-slices/functions/position-names-api';
import PositionNameDetails from 'components/Details/PositionNameDetails';
import { RequiresEditRole } from 'components/role-guards';
import EditPositionNameModal from '../Modal/EditPositionNameModal';
import { format } from 'date-fns';

const PositionNameAdmin = () => {
  const { t } = useTranslation();

  const [expandedRow, setExpandedRow] = useState<PositionName | null>(null);
  const [filteredPositionNames, setFilteredPositionNames] = useState<PositionName[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PositionName; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchPositionName, setSearchPositionName] = useState<string>('');
  const [showOnlyActive, setShowOnlyActive] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const { data: positionNames = [], isLoading: positionNamesLoading } = useGetPositionNamesQuery();

  const isLoading = positionNamesLoading;

  useEffect(() => {
    if (positionNames.length > 0) {
      setFilteredPositionNames(applyDefaultSorting(positionNames));
    } else {
      setFilteredPositionNames([]);
    }
  }, [positionNames]);

  const applyDefaultSorting = (data: PositionName[]) => {
    return [...data].sort((a, b) => {
      return a.name.localeCompare(b.name, 'fi');
    });
  };

  // UI callbacks

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleRowToggle = (subject: PositionName) => {
    setExpandedRow(expandedRow && expandedRow.id === subject.id ? null : subject);
  };

  const handleCloseDetails = () => {
    setExpandedRow(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /* Sorting logic */
  const handleSort = (key: keyof PositionName) => {
    setSortConfig((prevConfig) => {
      setPage(0);

      if (!prevConfig || prevConfig.key !== key) {
        // New key, sort the data based on the selected key and direction
        const sortedData = [...filteredPositionNames].sort((a, b) => {
          const valA = a[key] ?? '';
          const valB = b[key] ?? '';

          // Sort by date
          if (key === 'validFrom' || key === 'validUntil') {
            return (new Date(valA).getTime() || 0) - (new Date(valB).getTime() || 0);
          }

          // Sort by name
          return valA.localeCompare(valB, 'fi');
          //return valA < valB ? -1 : valA > valB ? 1 : 0;
        });

        setFilteredPositionNames(sortedData);
        return { key, direction: 'asc' };
      } else if (prevConfig.direction === 'asc') {
        // Previous config is the same key and ascending, so sort in descending order
        const sortedData = [...filteredPositionNames].sort((a, b) => {
          const valA = a[key] ?? '';
          const valB = b[key] ?? '';

          // Sort by date
          if (key === 'validFrom' || key === 'validUntil') {
            return (new Date(valB).getTime() || 0) - (new Date(valA).getTime() || 0);
          }

          // Sort by name
          return valB.localeCompare(valA, 'fi');
          //return valA > valB ? -1 : valA < valB ? 1 : 0;
        });

        setFilteredPositionNames(sortedData);
        return { key, direction: 'desc' };
      } else {
        // Default sorting
        setFilteredPositionNames(applyDefaultSorting(filteredPositionNames));
        return null;
      }
    });
  };

  // Search logic
  const handleSearch = () => {
    const filtered = positionNames.filter((p) => {
      const matchesName = searchPositionName
        ? p['name'].toLowerCase().includes(searchPositionName.toLowerCase())
        : true;

      const matchesActive =
        !showOnlyActive ||
        ((p.validFrom
          ? new Date(new Date(p.validFrom).setHours(0, 0, 0, 0)) <= new Date(new Date().setHours(0, 0, 0, 0))
          : true) &&
          (p.validUntil
            ? new Date(new Date().setHours(0, 0, 0, 0)) <= new Date(new Date(p.validUntil).setHours(0, 0, 0, 0))
            : true));

      return matchesName && matchesActive;
    });

    setFilteredPositionNames(applyDefaultSorting(filtered));
    setPage(0);
  };

  const handleSearchReset = () => {
    setSearchPositionName('');
    setFilteredPositionNames(applyDefaultSorting(positionNames));
    setShowOnlyActive(false);
    setPage(0);
  };

  // Pagination logic
  const paginatedPositionNames = filteredPositionNames.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            {/* Search by name */}
            <TextField
              label={t('admin_panel.search.byName')}
              value={searchPositionName}
              onChange={(e) => setSearchPositionName(e.target.value)}
              sx={{ minWidth: '300px' }}
            />

            {/* Search only active */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnlyActive}
                  onChange={(event) => setShowOnlyActive(event.target.checked)}
                  color="primary"
                />
              }
              label={t('admin_panel.position_name.show_only_active')}
              sx={{ minWidth: '250px' }}
            />

            {/* Search and clear buttons */}
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button variant="contained" onClick={handleSearch}>
                {t('search_filter.search')}
              </Button>

              <Button variant="outlined" onClick={handleSearchReset}>
                {t('search_filter.reset')}
              </Button>
            </Box>
          </Box>
        </Box>

        <RequiresEditRole>
          {/* Create new cost centre button */}
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
                  marginRight: '10px',
                }}
              >
                +
              </Box>
            }
          >
            {t('admin_panel.position_name.create_new')}
          </Button>
        </RequiresEditRole>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {/* Table Header */}
          <TableHead sx={{ backgroundColor: '#223B7C', height: '30px' }}>
            <TableRow>
              {/* Name header */}
              <TableCell
                sx={{
                  color: 'white',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '8px 16px',
                }}
                onClick={() => handleSort('name')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('admin_panel.position_name.name')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                  </Box>
                </Box>
              </TableCell>

              {/* Position name valid from */}
              <TableCell
                sx={{ width: '20%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px' }}
                onClick={() => handleSort('validFrom')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('admin_panel.position_name.valid_from')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'validFrom' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                  </Box>
                </Box>
              </TableCell>

              {/* Position name valid until */}
              <TableCell
                sx={{ width: '20%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px' }}
                onClick={() => handleSort('validUntil')}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {t('admin_panel.position_name.valid_until')}
                  <Box sx={{ width: '16px', textAlign: 'center' }}>
                    {sortConfig?.key === 'validUntil' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {paginatedPositionNames.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  sx={{
                    backgroundColor:
                      row === expandedRow
                        ? alpha('#223B7C', 0.5)
                        : paginatedPositionNames.indexOf(row) % 2 === 0
                          ? '#F9F9F9'
                          : alpha('#223B7C', 0.2),
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRowToggle(row)}
                >
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.name}</TableCell>
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>
                    {row.validFrom ? format(new Date(row.validFrom), 'd.M.yyyy') : ''}
                  </TableCell>
                  <TableCell sx={{ color: 'black', fontSize: '1rem' }}>
                    {row.validUntil ? format(new Date(row.validUntil), 'd.M.yyyy') : ''}
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
          count={positionNames.length}
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
            <PositionNameDetails
              positionName={expandedRow}
              doneEditingCallback={handleCloseDetails}
              allPositionNames={positionNames}
            />
          ) : null}
        </Grid2>
      </Grid2>

      {/* Create Position Name Modal */}
      <EditPositionNameModal
        open={createModalOpen}
        handleClose={handleCloseCreateModal}
        positionName={undefined}
        allPositionNames={positionNames}
        submitCallback={() => {
          handleCloseDetails();
          handleCloseCreateModal();
        }}
      />
    </Box>
  );
};

export default PositionNameAdmin;
