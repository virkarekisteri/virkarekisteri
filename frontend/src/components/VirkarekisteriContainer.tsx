import VirkarekisteriTable from './Table/VirkarekisteriTable';
import { Box } from '@mui/material';
import TopAppBar from './TopAppBar/TopAppBar';

const VirkarekisterContainer = () => {
  return (
    <div>
      <TopAppBar />
      <Box
        sx={{
          margin: 'auto',
          maxWidth: '90%',
        }}
      >
        <VirkarekisteriTable />
      </Box>
    </div>
  );
};

export default VirkarekisterContainer;
