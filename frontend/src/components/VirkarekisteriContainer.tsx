import { useState } from 'react';
import { Button, Grid2 } from '@mui/material';
import CreateVirkaModal from './Modal/CreateVirkaModal';
import VirkarekisteriTable from './Table/VirkarekisteriTable';
import { Box } from '@mui/material';
import TopAppBar from './TopAppBar/TopAppBar';

const VirkarekisterContainer = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleOpen = () => setOpenCreateModal(true);
  const handleClose = () => setOpenCreateModal(false);

  return (
    <div>
      <TopAppBar />
      <CreateVirkaModal open={openCreateModal} handleClose={handleClose} />
      {/* Other components and content will go here */}
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
              + Uusi virka
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
