import React from 'react';
import type { Position } from 'models/Position';
import BasicDetails from './BasicDetails';
import { Box } from '@mui/material';

interface PositionDetailsProps {
  position: Position;
}

const PositionDetails: React.FC<PositionDetailsProps> = ({ position }) => {
  return (
    <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, width: '100%' }}>
      {position && <BasicDetails position={position} />}
    </Box>
  );
};

export default PositionDetails;
