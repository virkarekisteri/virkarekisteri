import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab
  } from '@mui/material';
import SubjectAdmin from './SubjectAdmin';
import JobtitleAdmin from './JobtitleAdmin';
import CostcentreAdmin from './CostcentreAdmin';
import { useTranslation } from 'react-i18next';

const AdminPanelContainer = () => {
    const { t } = useTranslation();

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = ( _event: React.SyntheticEvent, newValue: number ) => {
        setSelectedTab(newValue);
    };
 
    return (
        <Box>
            <Box sx={{ width: 'fit-content', minWidth: '300px' }}>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
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
                            borderRadius: '4px 4px 0 0',
                            fontSize: '1.0rem',

                            '&:not(:last-child)': {
                                    marginRight: '8px',
                            },

                            '&.Mui-selected': {
                                color: '#FFFFFF',
                                backgroundColor: '#223B7C',
                            },
                        },
                    }}
                >
                    <Tab label= {t('admin_panel.titles.subjects')} />
                    <Tab label= {t('admin_panel.titles.job_titles')} />
                    <Tab label= {t('admin_panel.titles.cost_centres')} />
                </Tabs>
                
                <Box sx={{ height: '2px', backgroundColor: '#223b7c', width: '100%', my: 0 }} />
                <Box sx={{ height: '2px', backgroundColor: 'rgba(34, 59, 124, 0.2)', width: '100%', my: '10px' }} />
                
                
            </Box>
                <Box sx={{ p: 2 }}>
                    {selectedTab === 0 && <SubjectAdmin />}
                    {selectedTab === 1 && <JobtitleAdmin />}
                    {selectedTab === 2 && <CostcentreAdmin />}
                </Box>
        </Box>
    );
};

export default AdminPanelContainer