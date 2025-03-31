import React, { useEffect, useState } from 'react';
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
    TextField,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    alpha
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Costcentre } from 'models/Costcentre';
import { useGetCostCentersQuery } from 'redux/api-slices/functions/costcentre-api';
import { RequiresEditRole } from 'components/role-guards';


const CostcentreAdmin = () => {
    const { t } = useTranslation();

    const [expandedRow, setExpandedRow] = useState<Costcentre | null>(null);
    const [filteredCostcentres, setFilteredCostcentres] = useState<Costcentre[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Costcentre; direction: 'asc' | 'desc' } | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchCostcentreName, setSearchCostcentreName] = useState('');
    const [searchValid, setSearchValid] = useState(false);

    const { data: costcentres = [], isLoading: costcentresLoading } = useGetCostCentersQuery();

    const isLoading = costcentresLoading;

    useEffect(() => {
        setFilteredCostcentres(costcentres);
    }, [costcentres]);

    const paginatedCostcentres = filteredCostcentres.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = () => {
        const filtered = costcentres.filter((c) => {
            const matchesName = searchCostcentreName
                ? c['name'].toLowerCase().includes(searchCostcentreName.toLowerCase())
                : true;
            return matchesName;
        });

        console.log("Filtered costcentres:", filtered);
        setFilteredCostcentres(filtered);
        setPage(0);
    };

    const handleSearchReset = () => {
        setSearchCostcentreName('');
        setFilteredCostcentres(costcentres);
        setPage(0);
    }

    const handleSort = (key: keyof Costcentre) => {
        setSortConfig((prevConfig) => {
            const direction = prevConfig && prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc';
    
            const sortedData = [...filteredCostcentres].sort((a, b) => {
                const valA = a[key] ?? '';
                const valB = b[key] ?? '';
    
                if (key === 'validFrom' || key === 'validUntil') {
                    return (new Date(valA).getTime() || 0) - (new Date(valB).getTime() || 0) * (direction === 'asc' ? 1 : -1);
                }
    
                if (valA < valB) return direction === 'asc' ? -1 : 1;
                if (valA > valB) return direction === 'asc' ? 1 : -1;
                return 0;
            });
    
            setFilteredCostcentres(sortedData);
            return { key, direction };
        });
    };

    const handleRowToggle = (row: Costcentre) => {
        setExpandedRow(expandedRow && expandedRow.id === row.id ? null : row);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Search Controls */}
            
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>

                <Box display="flex" gap={2}>
                    <TextField
                        label={t('admin_panel.search.byName')}
                        value={searchCostcentreName}
                        onChange={(e) => setSearchCostcentreName(e.target.value)}
                    />

                    <Button variant="contained" onClick={handleSearch}>
                        {t('search_filter.search')}
                    </Button>

                    <Button variant="contained" onClick={handleSearchReset}>
                        {t('search_filter.reset')}
                    </Button>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={searchValid}
                                onChange={(event) => setSearchValid(event.target.checked)}
                                color="primary"
                            />
                        }
                        label={t('admin_panel.costcentre.valid')}    
                    />
                    
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

                    {/* Table Header */}

                    <TableHead sx={{ backgroundColor: '#223B7C', height: '30px'}}>
                        <TableRow>
                            <TableCell sx={{ width: '15%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px',}} onClick={() => handleSort('number')} >
                                <Box display="flex" alignItems="center" gap={2}>
                                    {t('admin_panel.costcentre.number')}
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        {sortConfig?.key === 'number' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                    </Box>
                                </Box>
                            </TableCell>

                            <TableCell sx={{ width: '40%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px',}} onClick={() => handleSort('name') } >
                                <Box display="flex" alignItems="center" gap={2}>
                                    {t('admin_panel.costcentre.name')}
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                    </Box>
                                </Box>
                            </TableCell>

                            <TableCell sx={{ width: '20%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px',}} onClick={() => handleSort('validFrom') }>
                                <Box display="flex" alignItems="center" gap={2}>
                                    {t('admin_panel.costcentre.valid_from')}
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        {sortConfig?.key === 'validFrom' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                    </Box>
                                </Box>
                            </TableCell>

                            <TableCell sx={{ width: '20%', color: 'white', fontSize: '1.2rem', cursor: 'pointer', padding: '8px 16px',}} onClick={() => handleSort('validUntil') }>
                                <Box display="flex" alignItems="center" gap={2}>
                                    {t('admin_panel.costcentre.valid_until')}
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        {sortConfig?.key === 'validUntil' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                    </Box>
                                </Box>
                            </TableCell>

                        </TableRow>
                    </TableHead>

                    {/* Table Body */}

                    <TableBody>
                        {paginatedCostcentres.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow
                                    sx={{
                                        backgroundColor: row === expandedRow ? alpha('#223B7C', 0.5) : (paginatedCostcentres.indexOf(row) % 2 === 0 ? '#F9F9F9' : alpha('#223B7C', 0.2)),
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleRowToggle(row)}
                                >
                                    <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.number}</TableCell>
                                    <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.name}</TableCell>
                                    <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.validFrom}</TableCell>
                                    <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.validUntil}</TableCell>

                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}

            <Box display="flex" justifyContent="center" mt={2}>
                <TablePagination
                component="div"
                count={costcentres.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={t('table.rows_per_page')}
                />
            </Box>
            
        </Box>
    )
}

export default CostcentreAdmin;