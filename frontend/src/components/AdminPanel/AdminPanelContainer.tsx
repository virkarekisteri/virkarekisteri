import React from 'react';
import {
  Box,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import SubjectAdmin from './SubjectAdmin';

const AdminPanelContainer = () => {
  return (
    <>
      <Tabs
        value={0}
        /* 
                    onChange={handleTabChange} */
        aria-label="Virkarekisteri Views"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: '#223B7C',
            height: '4px',
          },
          '& .MuiTab-root': {
            color: '#FFFFFF',
            backgroundColor: '#B0BEC5',
            fontWeight: 'bold',
            textTransform: 'none',
            padding: '10px 20px',
            spacing: '10px',
            borderRadius: '4px 4px 0 0',
            marginRight: '8px',
            fontSize: '1.0rem',
            '&.Mui-selected': {
              color: '#FFFFFF',
              backgroundColor: '#223B7C',
            },
          },
        }}
      >
        <Tab label={'Aineet'} />
        <Tab label={'Virkanimikkeet'} />
        <Tab label={'Kustannuspaikat'} />
      </Tabs>
      <Box
        sx={{
          height: '2px',
          backgroundColor: '#223b7c',
          width: '440px',
          my: 0,
        }}
      />

      <Box
        sx={{
          height: '2px',
          backgroundColor: alpha('#223B7C', 0.2),
          width: '100%',
          my: '10px',
        }}
      />
      <SubjectAdmin />
    </>
  );
};

export default AdminPanelContainer;
