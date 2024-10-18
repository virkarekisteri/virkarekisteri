import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid2 } from '@mui/material';
import CreateVirkaModal from './Modal/CreateVirkaModal';
import VirkarekisteriTable from './Table/VirkarekisteriTable';
import TopAppBar from './TopAppBar/TopAppBar';
import { useTranslation } from 'react-i18next';
import { getPositions, selectIndividualPosition, selectPositionLoading } from 'redux/slices/position-slice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import PositionDetails from './Details/PositionDetails';

const VirkarekisterContainer = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { t } = useTranslation();

  const handleOpen = () => setOpenCreateModal(true);
  const handleClose = () => setOpenCreateModal(false);
  const position = useAppSelector(selectIndividualPosition);
  const dataLoading = useAppSelector(selectPositionLoading);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getPositions());
  }, [dispatch]);

  return (
    <div>
      <TopAppBar />
      <CreateVirkaModal open={openCreateModal} handleClose={handleClose} />
      <Grid2 container spacing={2} margin="auto" width="90%" marginTop={5}>
        <Grid2 size={12} display="flex" justifyContent="flex-end" alignItems={'flex-end'}>
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
    </div>
  );
};

export default VirkarekisterContainer;
