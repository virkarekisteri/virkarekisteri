import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Typography,
    IconButton,
    CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { ChangeLogEntry } from 'models/ChangeLogEntry';
import { fetchAllChangeLogs } from 'services/functions/change-log-service';

const ChangeLogTable = () => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);
    const [loading, setLoading] = useState(false);

    const handleRowToggle = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

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
                        <TableCell sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}
                        >
                            Muokkaus PVM
                        </TableCell>
                        <TableCell sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}
                        >
                            Vakanssinumero
                        </TableCell>
                        <TableCell sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}
                        >
                            Muokattu kenttä
                        </TableCell>
                        <TableCell sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}
                        >
                            Päätösnumero
                        </TableCell>
                        <TableCell sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}
                        >
                            Muokkaaja
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {changeLogs.map((row) => (
                        <React.Fragment key={row.id}>
                            {/* Main Row */}
                            <TableRow
                                sx={{
                                    backgroundColor: changeLogs.indexOf(row) % 2 === 0 ? '#F9F9F9' : '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleRowToggle(row.id)}
                            >
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <IconButton size="small" sx={{ ml: 1 }}>
                                            {expandedRow === row.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                        {new Date(row.timestamp).toLocaleDateString()}
                                    </Box>
                                </TableCell>
                                <TableCell>{row.positionId}</TableCell>
                                <TableCell>{row.editedField}</TableCell>
                                <TableCell>{row.decisionNumber}</TableCell>
                                <TableCell>
                                    {row.editor}

                                </TableCell>
                            </TableRow>

                            {/* Expanded Row */}
                            {expandedRow === row.id && (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ padding: '16px', backgroundColor: '#F0F0F0' }}>
                                        <Typography fontWeight="bold" sx={{ mb: 2 }}>
                                            Muutos
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between" paddingLeft="5rem" paddingRight="5rem">
                                            <Box>
                                                <Typography fontWeight="bold">Vanha arvo</Typography>
                                                <Typography>{row.oldValue || '-'}</Typography>
                                            </Box>
                                            <Box>
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
