import React from 'react';
import type { Position } from 'models/Position';
import BasicDetails from './BasicDetails';
import { Box } from '@mui/material';
import EmployeeDetails from './EmployeeDetails';
import PositionChangeLog from './PositionChangeLog';

interface PositionDetailsProps {
  position: Position;
}

const PositionDetails: React.FC<PositionDetailsProps> = ({ position }) => {
  return (
    <>
      <Box sx={{ backgroundColor: '#f0f0f0', padding: 2, width: '100%' }}>
        {position && <BasicDetails position={position} />}
      </Box>
      <Box sx={{ backgroundColor: '#f0f0f0', padding: '0rem 2.5rem 1rem 2.5rem', width: '100%' }}>
        {position && <EmployeeDetails position={position} />}
      </Box>
      <Box sx={{ backgroundColor: '#f0f0f0', padding: '0rem 2.5rem 2rem 2.5rem', width: '100%' }}>
        {position && <PositionChangeLog position={position} />}
      </Box>
    </>
  );
};

export default PositionDetails;
