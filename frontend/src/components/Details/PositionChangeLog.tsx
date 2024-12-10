import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography, alpha } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid2 from '@mui/material/Grid2';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import type { Position } from 'models/Position';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useGetPositionChangeLogsQuery } from 'redux/api-slices/functions/changelogs-api';
import { skipToken } from '@reduxjs/toolkit/query';

interface PositionChangeLogProps {
  position: Position;
}

const PositionChangeLog: React.FC<PositionChangeLogProps> = ({ position }) => {
  const { t } = useTranslation();

  const { data: changeLogs = [] } = useGetPositionChangeLogsQuery(position.id ?? skipToken);

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'dd.MM.yyyy HH:mm:ss');
  };

  const getTranslatedField = (field: string) => {
    return t(`change_logs.fields.${field}`, field);
  };

  const mapTypeValue = (value: string) => {
    if (value === '1') {
      return t('position_type.position');
    } else if (value === '2') {
      return t('position_type.post');
    }
    return value;
  };

  const transformValue = (field: string, value: string | null) => {
    if ((field === 'VacancyFill' || field === 'VacancySize') && value) {
      const numericValue = typeof value === 'number' ? value : parseFloat(value.replace(',', '.'));
      if (!isNaN(numericValue)) {
        return (numericValue * 100).toFixed(0);
      }
    }
    return value;
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          backgroundColor: alpha('#223B7C', 1),
          color: 'white',
          minHeight: '45px',
          '&.Mui-expanded': {
            minHeight: '45px',
          },
          '& .MuiAccordionSummary-content': {
            margin: 0,
          },
        }}
      >
        <Typography>{t('change_logs.title')}</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '16px',
          backgroundColor: alpha('#f5f5f5', 1),
        }}
      >
        {changeLogs.length > 0 ? (
          <Grid2 container spacing={2}>
            {changeLogs.map((log) => {
              const oldValue =
                log.editedField === 'Type' ? mapTypeValue(log.oldValue) : transformValue(log.editedField, log.oldValue);

              const newValue =
                log.editedField === 'Type' ? mapTypeValue(log.newValue) : transformValue(log.editedField, log.newValue);

              return (
                <Grid2 key={log.id} size={{ xs: 12 }} container spacing={1} alignItems="center">
                  <Grid2 size={{ xs: 2 }}>
                    <RenderReadonlyTextField
                      label={t('change_logs.timestamp')}
                      value={formatTimestamp(log.timestamp)}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 2 }}>
                    <RenderReadonlyTextField label={t('change_logs.editor')} value={log.editor} />
                  </Grid2>
                  <Grid2 size={{ xs: 2 }}>
                    <RenderReadonlyTextField
                      label={t('change_logs.edited_field')}
                      value={getTranslatedField(log.editedField)}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 2 }}>
                    <RenderReadonlyTextField
                      label={t('change_logs.old_value')}
                      value={oldValue && oldValue.trim() !== '' ? oldValue : '-'}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 2 }}>
                    <RenderReadonlyTextField
                      label={t('change_logs.new_value')}
                      value={newValue && newValue.trim() !== '' ? newValue : '-'}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 2 }}>
                    <RenderReadonlyTextField label={t('change_logs.DecisionNumber')} value={log.decisionNumber} />
                  </Grid2>
                </Grid2>
              );
            })}
          </Grid2>
        ) : (
          <Typography variant="body1" sx={{ padding: 2, textAlign: 'left' }}>
            {t('change_logs.no_logs_found')}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default PositionChangeLog;
