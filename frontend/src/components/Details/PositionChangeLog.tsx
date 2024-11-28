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
import { format } from 'date-fns';

interface PositionChangeLogProps {
    position: Position;
}

const PositionChangeLog: React.FC<PositionChangeLogProps> = ({ position }) => {
    const { t } = useTranslation();
    const [changeLogs, setChangeLogs] = useState<ChangeLogEntry[]>([]);

    const formatTimestamp = (timestamp: string) => {
        return format(new Date(timestamp), 'dd.MM.yyyy HH:mm:ss');
    };

    const getTranslatedField = (field: string) => {
        return t(`change_logs.fields.${field}`, field);
    };

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
                <Typography variant="h6">{t("change_logs.title")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {changeLogs.length > 0 ? (
                    <Grid2 container spacing={2} sx={{ padding: 2, border: '1px solid #ccc', background: '#F5F5F5' }}>
                        {changeLogs.map((log, index) => (
                            <Grid2 key={index} size={{ xs: 12 }} container spacing={1} alignItems="center">
                                <Grid2 size={{ xs: 2 }}>
                                    <RenderReadonlyTextField
                                        label={t("change_logs.timestamp")}
                                        value={formatTimestamp(log.timestamp)}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 2 }}>
                                    <RenderReadonlyTextField label={t("change_logs.editor")} value={log.editor} />
                                </Grid2>
                                <Grid2 size={{ xs: 2 }}>
                                    <RenderReadonlyTextField
                                        label={t("change_logs.edited_field")}
                                        value={getTranslatedField(log.editedField)}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 2 }}>
                                    <RenderReadonlyTextField
                                        label={t("change_logs.old_value")}
                                        value={log.oldValue}
                                    />
                                </Grid2>
                                <Grid2 size={{ xs: 2 }}>
                                    <RenderReadonlyTextField
                                        label={t("change_logs.new_value")}
                                        value={log.newValue}
                                    />
                                </Grid2>
                            </Grid2>
                        ))}
                    </Grid2>
                ) : (
                    <Typography variant="body1" sx={{ padding: 2, textAlign: 'center' }}>
                        {t("change_logs.no_logs_found")}
                    </Typography>
                )}
            </AccordionDetails>
        </Accordion>
    );
};

export default PositionChangeLog;
