// VirkarekisterContainer.tsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import seinajokiLogo from '/seinajoki-logo.jpg';
import UserMenu from './UserMenu';
import { useState } from 'react';
import { Button, Grid2 } from '@mui/material';
import CreateVirkaModal from './Modal/CreateVirkaModal';
import VirkarekisteriTable from './Table/VirkarekisteriTable';
import { Box } from '@mui/material';

const VirkarekisterContainer = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleOpen = () => setOpenCreateModal(true);
  const handleClose = () => setOpenCreateModal(false);

  return (
    <div>
      <AppBar position="static" sx={{ height: '114px', backgroundColor: '#223B7C' }}>
        <Toolbar className="flex justify-between">
          <img src={seinajokiLogo} alt="Logo" className="h-full" />
          <div className="flex items-center space-x-4">
            <Typography
              variant="h6"
              component="div"
              sx={{ fontSize: '1.5rem', fontFamily: 'Trebuchet MS, sans-serif' }}
            >
              Virkarekisteri
            </Typography>
            <UserMenu />
          </div>
        </Toolbar>
      </AppBar>
      <CreateVirkaModal open={openCreateModal} handleClose={handleClose} />
      {/* Other components and content will go here */}
      <Box
        sx={{
          margin: 'auto',
          maxWidth: '90%',
          mt: 4,
        }}
      >
        <Grid2 container spacing={2}>
          <Grid2 size={12} display="flex" justifyContent="flex-end">
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
