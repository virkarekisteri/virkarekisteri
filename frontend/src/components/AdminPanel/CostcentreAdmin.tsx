import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TablePagination,
    TableHead, 
    TableRow, 
    TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Costcentre } from 'models/Costcentre';
import { RequiresEditRole, RequiresAdminRole } from 'components/role-guards';


const CostcentreAdmin = () => {
    const { t } = useTranslation();

    const [sortConfig, setSortConfig] = useState<{ key: keyof Costcentre; direction: 'asc' | 'desc' } | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchCostcentreName, setSearchCostcentreName] = useState('');

    const handleSort = (key: keyof Costcentre) => {
        setSortConfig((prevConfig) => {
            if (prevConfig && prevConfig.key ===key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    return (
        <Box>
            {/* Search Controls */}
            
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>

                <Box display="flex" gap={2}>
                    <TextField
                        label={t('admin_panel.search.byName')}
                    />

                    <Button variant="contained">
                        {t('search_filter.search')}
                    </Button>

                    <Button variant="contained">
                        {t('search_filter.reset')}
                    </Button>
                </Box>

                <RequiresEditRole>
                    <Button 
                        variant="contained"
                        // onclick={}
                        sx={{
                            backgroundColor: '#223B7C',
                            color: 'white',
                            fontSize: '1.0rem',
                            padding: '20px',
                            height: '40px',
                            display: 'flex',
                            borderRadius: '25px 8px 8px 25px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                        }}
                        startIcon={
                            <Box
                                component="span"
                                sx={{
                                    marginRight: '10px',
                                }}
                                >
                                +
                            </Box>
                        }
                        >
                        {t('admin_panel.costcentre.create_new')}
                    </Button>
                </RequiresEditRole>
            </Box>

            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#223B7C', height: '30px'}}>
                        <TableRow>
                            <TableCell sx={{ width: '15%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px',}} /* onClick={ jotain handlesort } */>
                                <Box display="flex" alignItems="center" gap={2}>
                                    {t('admin_panel.costcentre.number')}

                                </Box>
                            </TableCell>

                            <TableCell sx={{ width: '45%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px',}} /* onClick={ jotain handlesort } */>
                                <Box display="flex" alignItems="center" gap={2}>
                                    {t('admin_panel.costcentre.name')}
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        { /* sortConfig?.key === costcentreName && (sortConfig.direction === 'asc' ? '🔼' : '🔽') */ }
                                    </Box>
                                </Box>
                            </TableCell>

                            <TableCell sx={{ width: '20%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px',}} /* onClick={ jotain handlesort } */>
                                <Box display="flex" alignItems="center" gap={2}>
                                    {t('admin_panel.costcentre.valid_from')}

                                </Box>
                            </TableCell>

                            <TableCell sx={{ width: '20%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px',}} /* onClick={ jotain handlesort } */>
                                <Box display="flex" alignItems="center" gap={2}>
                                    {t('admin_panel.costcentre.valid_until')}

                                </Box>
                            </TableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>
                        
                    </TableBody>

                </Table>
            </TableContainer>

        </Box>
    )
}

export default CostcentreAdmin;