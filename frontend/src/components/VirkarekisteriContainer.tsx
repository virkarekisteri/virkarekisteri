import { useEffect, useState } from 'react';
import type { SnackbarCloseReason } from '@mui/material';
import { Box, Button, CircularProgress, Grid2, Snackbar } from '@mui/material';
import CreateVirkaModal from './Modal/CreateVirkaModal';
import UploadCsvModal from './Modal/UploadCsvModal';
import MassChangesModal from './Modal/MassChangesModal';
import VirkarekisteriTable from './Table/VirkarekisteriTable';
import TopAppBar from './TopAppBar/TopAppBar';
import { useTranslation } from 'react-i18next';
import { getPositions, selectIndividualPosition, selectPositionLoading } from 'redux/slices/position-slice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import PositionDetails from './Details/PositionDetails';
import { useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import LandingPage from './LandingPage';

const VirkarekisterContainer = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useIsAuthenticated();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openMassModal, setOpenMassModal] = useState(false);

  const { t } = useTranslation();

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleOpenUploadModal = () => setOpenUploadModal(true);
  const handleCloseUploadModal = () => setOpenUploadModal(false);

  const handleOpenMassModal = () => setOpenMassModal(true);
  const handleCloseMassModal = () => setOpenMassModal(false);

  const position = useAppSelector(selectIndividualPosition);
  const dataLoading = useAppSelector(selectPositionLoading);

  useEffect(() => {
    if (isAuthenticated) dispatch(getPositions());
  }, [dispatch, isAuthenticated]);

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
        <MassChangesModal open={openMassModal} handleClose={handleCloseMassModal} />
        <Grid2 container spacing={3} margin="auto" width="90%" marginTop={3}>
          <Grid2 size={12} display="flex" justifyContent="right" alignItems={'flex-end'} sx={{ gap: 5 }}>
            <Button
              variant="contained"
              onClick={() => {
                handleOpenMassModal();
                handleClick();
              }}
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
              {t('mass_changes.make_changes')}
            </Button>
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              message={t('mass_changes.update_value_message')}
            />
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
          <Grid2 size={12}>
            <VirkarekisteriTable />
          </Grid2>
          <Grid2 size={12}>
            {dataLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              position && <PositionDetails position={position} />
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
