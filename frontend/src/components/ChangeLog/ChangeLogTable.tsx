import React, { useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const mockChangeLogData = [
    {
        id: 1,
        muokkausPvm: '09.10.2024',
        vakanssinumero: '40100100',
        muokattuKentta: 'Viran haltija',
        paatosnumero: 'Poj § 120/20',
        muokkaaja: 'Minni Hiiri',
        changes: [
            { vanhaArvo: 'Matti Meikäläinen', uusiArvo: 'Hannu Hanh', selite: 'Viranhaltija muutettu' },
        ],
    },
    {
        id: 2,
        muokkausPvm: '18.09.2024',
        vakanssinumero: '40100100',
        muokattuKentta: 'Viran tila',
        paatosnumero: 'Kok. 09/24',
        muokkaaja: 'Aku Ankka',
        changes: [],
    },
    {
        id: 3,
        muokkausPvm: '24.07.2024',
        vakanssinumero: '40862500',
        muokattuKentta: 'Kelpoisuusehto',
        paatosnumero: 'Poj § 111/19',
        muokkaaja: 'Valma Virkailija',
        changes: [],
    },
];

const ChangeLogTable = () => {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const handleRowToggle = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

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
                        }}>Muokkaus PVM</TableCell>
                        <TableCell sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}>Vakanssinumero</TableCell>
                        <TableCell sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}>Muokattu kenttä</TableCell>
                        <TableCell sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}>Päätösnumero</TableCell>
                        <TableCell sx={{
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            padding: '8px 16px',
                        }}>Muokkaaja</TableCell>
                    </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                    {mockChangeLogData.map((row) => (
                        <React.Fragment key={row.id}>
                            {/* Main Row */}
                            <TableRow
                                sx={{
                                    backgroundColor: row.id % 2 === 0 ? '#F9F9F9' : '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleRowToggle(row.id)}
                            >
                                <TableCell>{row.muokkausPvm}</TableCell>
                                <TableCell>{row.vakanssinumero}</TableCell>
                                <TableCell>{row.muokattuKentta}</TableCell>
                                <TableCell>{row.paatosnumero}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        {row.muokkaaja}
                                        <IconButton size="small" sx={{ ml: 1 }}>
                                            {expandedRow === row.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>

                            {/* Expanded Row */}
                            {expandedRow === row.id && row.changes.length > 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ padding: '16px', backgroundColor: '#F0F0F0' }}>
                                        <Typography fontWeight="bold" sx={{ mb: 2 }}>
                                            Muutos
                                        </Typography>
                                        <Box display="flex" justifyContent="space-between">
                                            <Box>
                                                <Typography fontWeight="bold">Vanha arvo</Typography>
                                                <Typography>{row.changes[0]?.vanhaArvo || '-'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography fontWeight="bold">Uusi arvo</Typography>
                                                <Typography>{row.changes[0]?.uusiArvo || '-'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography fontWeight="bold">Selite</Typography>
                                                <Typography>{row.changes[0]?.selite || '-'}</Typography>
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
