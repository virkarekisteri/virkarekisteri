import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid2, Tab, Tabs } from '@mui/material';
import CreateVirkaModal from './Modal/CreateVirkaModal';
import UploadCsvModal from './Modal/UploadCsvModal';
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
import ChangeLogTable from './ChangeLog/ChangeLogTable';
import type { Position } from 'models/Position';

const VirkarekisterContainer = () => {
  const isAuthenticated = useIsAuthenticated();

  const dispatch = useAppDispatch();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    dispatch(clearSelectedPosition());
  };

  const { t } = useTranslation();

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleOpenUploadModal = () => setOpenUploadModal(true);
  const handleCloseUploadModal = () => setOpenUploadModal(false);

  const selectedPositionId = useAppSelector(selectSelectedPosition);
  const [selectedPosition, setSelectedPosition] = useState<Position | undefined>(undefined);

  const { isLoading } = useGetPositionsQuery(isAuthenticated ? undefined : skipToken);
  const { data: fetchedPosition, isLoading: singlePositionLoading } = useGetPositionQuery(
    isAuthenticated ? (selectedPositionId ?? skipToken) : skipToken,
  );

  useEffect(() => {
    if (!selectedPositionId) setSelectedPosition(undefined);
    else if (fetchedPosition) setSelectedPosition(fetchedPosition);
  }, [fetchedPosition, selectedPositionId]);

  return (
    <>
      <TopAppBar />
      <AuthenticatedTemplate>
        <CreateVirkaModal open={openCreateModal} handleClose={handleCloseCreateModal} />
        <UploadCsvModal open={openUploadModal} handleClose={handleCloseUploadModal} />
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
            </Grid2>

            <Grid2 size="auto" display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={handleOpenUploadModal}
                sx={{
                  backgroundColor: '#223B7C',
                  color: 'white',
                  fontSize: '1.2rem',
                  padding: '20px',
                  height: '45px',
                  display: 'flex',
                  borderRadius: '25px 8px 8px 25px',
                }}
                startIcon={
                  <Box
                    component="span"
                    sx={{
                      marginRight: '40px',
                    }}
                  >
                    +
                  </Box>
                }
              >
                {t('create_csv_position.upload_csv')}
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenCreateModal}
                sx={{
                  backgroundColor: '#223B7C',
                  color: 'white',
                  fontSize: '1.2rem',
                  padding: '20px',
                  height: '45px',
                  display: 'flex',
                  borderRadius: '25px 8px 8px 25px',
                }}
                startIcon={
                  <Box
                    component="span"
                    sx={{
                      marginRight: '40px',
                    }}
                  >
                    +
                  </Box>
                }
              >
                {t('new_position')}
              </Button>
            </Grid2>
          </Grid2>
          <Grid2 size={12}>
            {activeTab === 0 && (
              <>
                {isLoading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                  </Box>
                ) : (
                  <VirkarekisteriTable />
                )}
              </>
            )}
            {activeTab === 1 && <ChangeLogTable />}
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
