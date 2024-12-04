import React from 'react';
import { Box, Typography } from '@mui/material';

const ChangeLogTable: React.FC = () => {
    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4">Muutoshistoria</Typography>
            <Typography variant="body1">Here you can display the change history data.</Typography>
        </Box>
    );
};

export default ChangeLogTable;
