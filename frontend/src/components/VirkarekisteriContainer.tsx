import { useState } from 'react';
import { Button, Grid2, Box } from '@mui/material';
import CreateVirkaModal from './Modal/CreateVirkaModal';
import VirkarekisteriTable from './Table/VirkarekisteriTable';
import TopAppBar from './TopAppBar/TopAppBar';
import { useTranslation } from 'react-i18next';

const VirkarekisterContainer = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { t } = useTranslation();

  const handleOpen = () => setOpenCreateModal(true);
  const handleClose = () => setOpenCreateModal(false);

  return (
    <div>
      <TopAppBar />
      <CreateVirkaModal open={openCreateModal} handleClose={handleClose} />
      <Box
        sx={{
          margin: 'auto',
          maxWidth: '90%',
          mt: 4,
        }}
      >
        <Grid2 container>
          <Grid2 size={12} display="flex" justifyContent="flex-end" alignItems={'flex-end'}>
            <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: '#223B7C' }}>
              {t('new_position')}
            </Button>
          </Grid2>
          <Grid2 size={12}>
            <VirkarekisteriTable />
          </Grid2>
        </Grid2>
      </Box>
    </div>
  );
};

export default VirkarekisterContainer;
