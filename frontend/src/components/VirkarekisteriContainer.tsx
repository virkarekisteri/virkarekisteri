import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid2 } from '@mui/material';
import CreateVirkaModal from './Modal/CreateVirkaModal';
import VirkarekisteriTable from './Table/VirkarekisteriTable';
import TopAppBar from './TopAppBar/TopAppBar';
import { useTranslation } from 'react-i18next';
import {
  getPositions,
  selectIndividualPosition,
  selectPositionLoading,
  uploadPositionsFromCsv,
} from 'redux/slices/position-slice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import PositionDetails from './Details/PositionDetails';
import { useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import LandingPage from './LandingPage';

const VirkarekisterContainer = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useIsAuthenticated();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { t } = useTranslation();

  const handleOpen = () => setOpenCreateModal(true);
  const handleClose = () => setOpenCreateModal(false);
  const position = useAppSelector(selectIndividualPosition);
  const dataLoading = useAppSelector(selectPositionLoading);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await dispatch(uploadPositionsFromCsv(formData));
      setSelectedFile(null);
      dispatch(getPositions());
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) dispatch(getPositions());
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <TopAppBar />
      <AuthenticatedTemplate>
        <CreateVirkaModal open={openCreateModal} handleClose={handleClose} />
        <Grid2 container spacing={2} margin="auto" width="90%" marginTop={5}>
          <Grid2 size={12} display="flex" justifyContent="space-between" alignItems={'flex-end'}>
            <Box>
              <Button
                variant="contained"
                onClick={handleFileUpload}
                disabled={uploading || !selectedFile}
                sx={{ backgroundColor: '#223B7C', margin: '0 10px 0 30px' }}
              >
                {uploading ? t('create_csv_position.loading') : t('create_csv_position.upload_csv')}
              </Button>
              <input type="file" accept=".csv" onChange={handleFileChange} style={{ margin: 0 }} />
            </Box>
            <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#223B7C' }}>
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
