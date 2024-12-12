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
    <Box
      sx={{
        padding: 0,
        width: '100%',
        marginBottom: '100px',
        '& > :nth-of-type(1)': { padding: 0 }, // Styles for BasicDetails
        '& > :nth-of-type(2)': { padding: 0 }, // Styles for EmployeeDetails
        '& > :nth-of-type(3)': { padding: 0 }, // Styles for PositionChangeLog
      }}
    >
      <BasicDetails position={position} />
      <EmployeeDetails position={position} />
      <PositionChangeLog position={position} />
    </Box>
  );
};
export default PositionDetails;
