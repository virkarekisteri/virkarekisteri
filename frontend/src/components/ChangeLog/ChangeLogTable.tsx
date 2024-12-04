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
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof ChangeLogEntry; direction: 'asc' | 'desc' } | null>(null);
    const positions = useAppSelector(selectPositionData);

    const handleRowToggle = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
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
        if (!sortConfig) return changeLogs;
        return [...changeLogs].sort((a, b) => {
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
    }, [changeLogs, sortConfig]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchAllChangeLogs();
                setChangeLogs(data);
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

    const getTranslatedField = (field: string) => {
        return t(`change_logs.fields.${field}`, field);
    };

    const formatTimestamp = (timestamp: string) => {
        return format(new Date(timestamp), 'dd.MM.yyyy HH:mm:ss');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
            </Box>
        );
    }

    return (
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
                    {sortedChangeLogs.map((row) => (
                        <React.Fragment key={row.id}>
                            <TableRow
                                sx={{
                                    backgroundColor: sortedChangeLogs.indexOf(row) % 2 === 0 ? '#F9F9F9' : alpha('#223B7C', 0.2),
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
                                <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{getVacancyNumber(row.positionId)}</TableCell>
                                <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{getTranslatedField(row.editedField)}</TableCell>
                                <TableCell sx={{ color: 'black', fontSize: '1rem' }}>{row.decisionNumber}</TableCell>
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
    );
};

export default ChangeLogTable;
