import React, { useEffect, useState } from 'react';
import type { SnackbarCloseReason } from '@mui/material';
import { Box, Button, CircularProgress, Grid2, Tab, Tabs, Snackbar, alpha } from '@mui/material';
import CreateVirkaModal from './Modal/CreateVirkaModal';
import UploadCsvModal from './Modal/UploadCsvModal';
import MassChangesModal from './Modal/MassChangesModal';
import VirkarekisteriTable from './Table/VirkarekisteriTable';
import TopAppBar from './TopAppBar/TopAppBar';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import PositionDetails from './Details/PositionDetails';
import { useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import LandingPage from './LandingPage';
import { useGetPositionQuery, useGetPositionsQuery } from 'redux/api-slices/functions/positions-api';
import { skipToken } from '@reduxjs/toolkit/query';
import { clearSelectedPosition, selectSelectedPosition } from 'redux/slices/position-slice';
import { RequiresAdminRole, RequiresEditRole } from './role-guards';
import PositionChangeLogTable from './PositionChangeLog/PositionChangeLogTable';
import type { Position } from 'models/Position';

const VirkarekisterContainer = () => {
  const isAuthenticated = useIsAuthenticated();

  const dispatch = useAppDispatch();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openMassModal, setOpenMassModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    dispatch(clearSelectedPosition());
  };

  const { t } = useTranslation();

  const [selectedRows, setSelectedRows] = useState<Position[]>([]);

  const handleUpdateSelectedRows = (rows: Position[]) => {
    setSelectedRows(rows);
  };

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleOpenUploadModal = () => setOpenUploadModal(true);
  const handleCloseUploadModal = () => setOpenUploadModal(false);

  const selectedPositionId = useAppSelector(selectSelectedPosition);
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>(undefined);

  const handleOpenMassModal = () => setOpenMassModal(true);
  const handleCloseMassModal = () => setOpenMassModal(false);

  const { isLoading } = useGetPositionsQuery(isAuthenticated ? undefined : skipToken);
  const { data: fetchedPosition, isLoading: singlePositionLoading } = useGetPositionQuery(
    isAuthenticated ? (selectedPositionId ?? skipToken) : skipToken,
  );

  useEffect(() => {
    if (!selectedPositionId) setSelectedPosition(undefined);
    else if (fetchedPosition) setSelectedPosition(fetchedPosition);
  }, [fetchedPosition, selectedPositionId]);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClick = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <>
      <TopAppBar />
      <AuthenticatedTemplate>
        <CreateVirkaModal open={openCreateModal} handleClose={handleCloseCreateModal} />
        <UploadCsvModal open={openUploadModal} handleClose={handleCloseUploadModal} />
        <MassChangesModal open={openMassModal} handleClose={handleCloseMassModal} selectedRows={selectedRows} />
        <Grid2 container spacing={3} margin="auto" width="90%" marginTop={3}>
          <Grid2 container size={12} alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
            <Grid2 size="auto">
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Virkarekisteri Views"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#223B7C',
                    height: '4px',
                  },
                  '& .MuiTab-root': {
                    color: '#FFFFFF',
                    backgroundColor: '#B0BEC5',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px 4px 0 0',
                    marginRight: '8px',
                    fontSize: '1.0rem',
                    '&.Mui-selected': {
                      color: '#FFFFFF',
                      backgroundColor: '#223B7C',
                    },
                  },
                }}
              >
                <Tab label={t('tabs.positions')} />
                <Tab label={t('tabs.history')} />
              </Tabs>
              <Box
                sx={{
                  height: '2px',
                  backgroundColor: '#223b7c',
                  width: '97.3%',
                  my: 0,
                }}
              />
            </Grid2>

            <Grid2 size="auto" display="flex" gap={3}>
              <RequiresAdminRole>
                <Button
                  variant="contained"
                  disabled={selectedRows.length < 2}
                  onClick={() => {
                    handleOpenMassModal();
                    handleClick();
                  }}
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
                  {t('mass_changes.make_changes')}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleOpenUploadModal}
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
                  {t('create_csv_position.upload_csv')}
                </Button>
              </RequiresAdminRole>
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
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={t('mass_changes.update_value_message')}
              />
            </Grid2>
          </Grid2>
          <Box
            sx={{
              height: '2px',
              backgroundColor: alpha('#223B7C', 0.2),
              width: '100%',
              my: 0,
            }}
          />
          <Grid2 size={12}>
            {activeTab === 0 && (
              <>
                {isLoading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                  </Box>
                ) : (
                  <VirkarekisteriTable onRowSelectionChange={handleUpdateSelectedRows} />
                )}
              </>
            )}
            {activeTab === 1 && <PositionChangeLogTable />}
          </Grid2>
          <Grid2 size={12}>
            {singlePositionLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              selectedPosition && <PositionDetails position={selectedPosition} />
            )}
          </Grid2>
        </Grid2>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LandingPage />
      </UnauthenticatedTemplate>
    </>
  );
};

export default VirkarekisterContainer;
