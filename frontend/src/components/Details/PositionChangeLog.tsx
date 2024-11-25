import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid2 from '@mui/material/Grid2';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import type { Position } from 'models/Position';
import { useTranslation } from 'react-i18next';
import type { ChangeLogEntry } from 'models/ChangeLogEntry';
import { useState, useEffect } from 'react';
import { fetchPositionChangeLogs } from 'services/functions/positions-service';

interface PositionChangeLogProps {
    position: Position;
}

const PositionChangeLog: React.FC<PositionChangeLogProps> = ({ position }) => {
    const { t } = useTranslation();
    const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);

    useEffect(() => {
        const loadChangeLogs = async () => {
            if (position.id) {
                const logs = await fetchPositionChangeLogs(position.id);
                setChangeLogs(logs)
            }
        };

        loadChangeLogs();
    }, [position.id]);

    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Viran muutoshistoria</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid2 container spacing={2} sx={{ padding: 2, border: '1px solid #ccc', background: '#F5F5F5' }}>
                    {changeLogs.map((log, index) => (
                        <Grid2 key={index} size={{ xs: 12 }} container spacing={1} alignItems="center">
                            <Grid2 size={{ xs: 3 }}>
                                <RenderReadonlyTextField label="Muutoksen tekijä" value={log.editor} />
                            </Grid2>
                            <Grid2 size={{ xs: 3 }}>
                                <RenderReadonlyTextField
                                    label="Muokattu kenttä"
                                    value={log.editedField}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 3 }}>
                                <RenderReadonlyTextField
                                    label="Vanha arvo"
                                    value={log.oldValue}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: 3 }}>
                                <RenderReadonlyTextField
                                    label="Uusi arvo"
                                    value={log.newValue}
                                />
                            </Grid2>
                        </Grid2>
                    ))}
                </Grid2>
            </AccordionDetails>
        </Accordion>
    );
};

export default PositionChangeLog;
