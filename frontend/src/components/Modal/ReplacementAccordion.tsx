import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, TextField, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import type { PositionEmployee } from 'models/PositionEmployee';

interface ReplacementAccordionProps {
  initialValues?: PositionEmployee;
}

const ReplacementAccordion: React.FC<ReplacementAccordionProps> = ({ initialValues }) => {
  const { t } = useTranslation();

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{t('employee.replacement_details')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Field name="replacementEmployeeName" initialValue={initialValues?.employeeName}>
          {({ input }) => (
            <TextField {...input} margin="normal" required fullWidth label={t('employee.replacement_name')} />
          )}
        </Field>
        <Field name="replacementStartDate" initialValue={initialValues?.startDate}>
          {({ input }) => (
            <TextField
              {...input}
              margin="normal"
              required
              fullWidth
              type="date"
              label={t('employee.replacement_start_date')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}
        </Field>
        <Field name="replacementEndingDate" initialValue={initialValues?.endingDate}>
          {({ input }) => (
            <TextField
              {...input}
              margin="normal"
              required
              fullWidth
              type="date"
              label={t('employee.replacement_end_date')}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}
        </Field>
      </AccordionDetails>
    </Accordion>
  );
};

export default ReplacementAccordion;
