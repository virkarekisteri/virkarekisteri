import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    IconButton,
    CircularProgress,
    alpha,
    Typography,
    TablePagination,
    TextField,
    Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { ChangeLogEntry } from 'models/ChangeLogEntry';
import { fetchAllChangeLogs } from 'services/functions/change-log-service';
import { useAppSelector } from 'redux/hooks';
import { selectPositionData } from 'redux/slices/position-slice';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const ChangeLogTable = () => {
    const { t } = useTranslation();

    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);
    const [filteredChangeLogs, setFilteredChangeLogs] = useState<ChangeLogEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof ChangeLogEntry; direction: 'asc' | 'desc' } | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchVacancyNumber, setSearchVacancyNumber] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const positions = useAppSelector(selectPositionData);

    const handleRowToggle = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };


    const getTranslatedField = (field: string) => {
        return t(`change_logs.fields.${field}`, field);
    };


    const handleSort = (key: keyof ChangeLogEntry) => {
        setSortConfig((prevConfig) => {
            if (prevConfig && prevConfig.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const sortedChangeLogs = React.useMemo(() => {
        if (!sortConfig) return filteredChangeLogs;
        return [...filteredChangeLogs].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    }, [filteredChangeLogs, sortConfig]);

    const handleSearch = () => {
        const filtered = changeLogs.filter((log) => {
            const matchesVacancyNumber = searchVacancyNumber
                ? getVacancyNumber(log.positionId).includes(searchVacancyNumber)
                : true;
            const matchesDate = searchDate
                ? formatTimestamp(log.timestamp).includes(searchDate)
                : true;
            return matchesVacancyNumber && matchesDate;
        });
        setFilteredChangeLogs(filtered);
        setPage(0); // Reset to first page
    };

    const handleResetSearch = () => {
        setSearchVacancyNumber('');
        setSearchDate('');
        setFilteredChangeLogs(changeLogs);
        setPage(0); // Reset to first page
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchAllChangeLogs();
                setChangeLogs(data);
                setFilteredChangeLogs(data);
            } catch (error) {
                console.error('Error fetching change logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getVacancyNumber = (positionId: string): string => {
        const position = positions.find((pos) => pos.id === positionId);
        return position?.vacancyNumber || '-';
    };

    const formatTimestamp = (timestamp: string) => {
        return format(new Date(timestamp), 'dd.MM.yyyy HH:mm:ss');
    };

    const paginatedChangeLogs = sortedChangeLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Search Controls */}
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Etsi vakanssinumerolla"
                    value={searchVacancyNumber}
                    onChange={(e) => setSearchVacancyNumber(e.target.value)}
                />
                <TextField
                    label="Etsi päivämäärällä"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                />
                <Button variant="contained" onClick={handleSearch}>
                    Hae
                </Button>
                <Button variant="outlined" onClick={handleResetSearch}>
                    Tyhjennä
                </Button>
            </Box>

            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    {/* Table Header */}
                    <TableHead sx={{ backgroundColor: '#223B7C', height: '30px' }}>
                        <TableRow>
                            <TableCell
                                sx={{
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    padding: '8px 16px',
                                }}
                                onClick={() => handleSort('timestamp')}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    Muokkaus PVM
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        {sortConfig?.key === 'timestamp' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    padding: '8px 16px',
                                }}
                                onClick={() => handleSort('positionId')}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    Vakanssinumero
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        {sortConfig?.key === 'positionId' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    padding: '8px 16px',
                                }}
                                onClick={() => handleSort('editedField')}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    Muokattu kenttä
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        {sortConfig?.key === 'editedField' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    padding: '8px 16px',
                                }}
                                onClick={() => handleSort('decisionNumber')}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    Päätösnumero
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        {sortConfig?.key === 'decisionNumber' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    padding: '8px 16px',
                                }}
                                onClick={() => handleSort('editor')}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    Muokkaaja
                                    <Box sx={{ width: '16px', textAlign: 'center' }}>
                                        {sortConfig?.key === 'editor' && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {paginatedChangeLogs.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow
                                    sx={{
                                        backgroundColor:
                                            paginatedChangeLogs.indexOf(row) % 2 === 0
                                                ? '#F9F9F9'
                                                : alpha('#223B7C', 0.2),
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleRowToggle(row.id)}
                                >
                                    <TableCell sx={{ color: 'black', fontSize: '1rem' }}>
                                        <Box display="flex" alignItems="center">
                                            <IconButton size="small" sx={{ ml: 1 }}>
                                                {expandedRow === row.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                            {formatTimestamp(row.timestamp)}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'black', fontSize: '1rem' }}>
                                        {getVacancyNumber(row.positionId)}
                                    </TableCell>
                                    <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{getTranslatedField(row.editedField)}</TableCell>                                    <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.decisionNumber}</TableCell>
                                    <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.editor}</TableCell>
                                </TableRow>

                                {/* Expanded Row */}
                                {expandedRow === row.id && (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ padding: '16px', backgroundColor: '#F0F0F0' }}>
                                            <Typography fontWeight="bold" sx={{ mb: 2 }}>
                                                Muutos
                                            </Typography>
                                            <Box display="flex" justifyContent="space-between" paddingX={5}>
                                                <Box sx={{ flex: 1, textAlign: 'left', paddingRight: 2 }}>
                                                    <Typography fontWeight="bold">Vanha arvo</Typography>
                                                    <Typography>{row.oldValue || '-'}</Typography>
                                                </Box>
                                                <Box sx={{ flex: 1, textAlign: 'left', paddingLeft: 2 }}>
                                                    <Typography fontWeight="bold">Uusi arvo</Typography>
                                                    <Typography>{row.newValue || '-'}</Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={2}>
                <TablePagination
                    component="div"
                    count={sortedChangeLogs.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={t('table.rows_per_page')}
                />
            </Box>
        </Box>
    );
};

export default ChangeLogTable;
