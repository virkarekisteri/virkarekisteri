import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

const ReplacementAccordion: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{t('employee.replacement_details')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Field name="employeeName">
          {({ input }) => (
            <TextField {...input} margin="normal" required fullWidth label={t('employee.replacement_name')} />
          )}
        </Field>
        <Field name="startDate">
          {({ input }) => (
            <TextField
              {...input}
              margin="normal"
              required
              fullWidth
              type="date"
              label={t('employee.replacement_start_date')}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </Field>
        <Field name="endingDate">
          {({ input }) => (
            <TextField
              {...input}
              margin="normal"
              required
              fullWidth
              type="date"
              label={t('employee.replacement_end_date')}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </Field>
      </AccordionDetails>
    </Accordion>
  );
};

export default ReplacementAccordion;
