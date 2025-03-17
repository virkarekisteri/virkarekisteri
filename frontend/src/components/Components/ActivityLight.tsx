import { TextField } from '@mui/material';
import React from 'react';
import { Box } from '@mui/material';

export interface ActivityLightProps {
  value : boolean;
  labeltrue: string;
  labelfalse: string;
}

const ActivityLight = ({ value, labeltrue, labelfalse }: ActivityLightProps) => {

    let statusText = '';
    let color = '';

    if (value) {
      statusText = labeltrue; 
      color = 'green';
    } else {
      statusText = labelfalse;
      color = 'red'
    }

    return (
      <Box display="flex" alignItems="center">
        <Box
          component="span"
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
            marginRight: 1,
          }}
        />
        {statusText}
      </Box>
    );
};

export default React.memo(ActivityLight);
