import React from 'react';
import { Box, Grid2, IconButton, Modal, Typography, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Form, Field } from 'react-final-form';
import { useGetCostCentersQuery } from 'redux/api-slices/functions/costcentre-api';
import { useCreateCostCentreMutation } from 'redux/api-slices/functions/costcentre-api';

interface CreateCostcentreModalProps {
  open: boolean;
  onClose: () => void;
}

interface formValues {
  number: string;
  name: string;
  validFrom?: string;
  validUntil?: string;
}

const CreateCostcentreModal: React.FC<CreateCostcentreModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [createCostCentre] = useCreateCostCentreMutation();

  const { data: costcentres } = useGetCostCentersQuery();

  const onSubmit = async (values: formValues) => {
    try {
      const costcentreData = {
        number: parseInt(values.number),
        name: values.name,
        validFrom: values.validFrom ? new Date(values.validFrom).toISOString().split('T')[0] : undefined,
        validUntil: values.validUntil ? new Date(values.validUntil).toISOString().split('T')[0] : undefined,
      };
      createCostCentre(costcentreData);
      onClose();
    } catch (error) {
      console.error('Failed to create costcentre:', error);
    }
  };

  // Checks whether the costcentre number is valid and not already in use
  const validateCostcentreNumber = (value: string) => {
    if (!value) {
      return t('admin_panel.costcentre.validation.required');
    }
    if (isNaN(Number(value))) {
      return t('admin_panel.costcentre.validation.invalid_number');
    }
    if (costcentres?.some((costcentre) => costcentre.number.toString() === value)) {
      return t('admin_panel.costcentre.validation.duplicate_number');
    }
    if (value.length != 4) {
      return t('admin_panel.costcentre.validation.invalid_number');
    }
    return undefined;
  };

  // Checks whether the costcentre name is valid and not already in use
  const validateCostcentreName = (value: string) => {
    if (!value) {
      return t('admin_panel.costcentre.validation.required');
    }
    if (costcentres?.some((costcentre) => costcentre.name === value)) {
      return t('admin_panel.costcentre.validation.duplicate_name');
    }
    return undefined;
  };

  // Checks whether the valid from date is before the valid until date
  const validateValidUntil = (value: string, allValues: formValues) => {
    if (allValues.validFrom && value) {
      const validFromDate = new Date(allValues.validFrom);
      const validUntilDate = new Date(value);
      if (validUntilDate <= validFromDate) {
        return t('admin_panel.costcentre.validation.invalid_date');
      }
    }
    return undefined;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 800,
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 0,
          borderRadius: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            height: 50,
            bgcolor: '#223B7C',
            color: 'white',
            borderTopLeftRadius: 1,
            borderTopRightRadius: 1,
          }}
        >
          <Typography variant="h6">{t('admin_panel.costcentre.create_new')}</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4, pt: 0 }}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, submitting, pristine, hasValidationErrors }) => (
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2} size={12}>
                  {/* Subtitle */}
                  <Box sx={{ px: 2, mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#223B7C' }}>
                      {t('admin_panel.costcentre.details')}
                    </Typography>
                  </Box>

                  <Grid2 size={12} sx={{ display: 'flex', gap: 2 }}>
                    {/* Number */}
                    <Grid2 size={1}>
                      <Field name="number" validate={validateCostcentreNumber}>
                        {({ input, meta }) => {
                          return (
                            <TextField
                              {...input}
                              required
                              margin="normal"
                              label={t('admin_panel.costcentre.number')}
                              error={meta.error && meta.touched}
                              helperText={meta.touched && meta.error}
                              slotProps={{
                                inputLabel: {
                                  shrink: true,
                                },
                              }}
                              sx={{ width: '360px' }}
                            />
                          );
                        }}
                      </Field>
                    </Grid2>

                    {/* Name */}
                    <Grid2 size={2}>
                      <Field name="name" validate={validateCostcentreName}>
                        {({ input, meta }) => {
                          return (
                            <TextField
                              {...input}
                              required
                              margin="normal"
                              label={t('admin_panel.costcentre.name')}
                              error={meta.error && meta.touched}
                              helperText={meta.touched && meta.error}
                              slotProps={{
                                inputLabel: {
                                  shrink: true,
                                },
                              }}
                              sx={{ width: '360px' }}
                            />
                          );
                        }}
                      </Field>
                    </Grid2>
                  </Grid2>

                  <Grid2 size={12} sx={{ display: 'flex', gap: 2 }}>
                    {/* Valid from */}
                    <Grid2 size={2}>
                      <Field name="validFrom">
                        {({ input, meta }) => (
                          <TextField
                            {...input}
                            margin="normal"
                            label={t('admin_panel.costcentre.valid_from')}
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ width: '360px' }}
                            error={meta.error && meta.touched}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                    </Grid2>

                    {/* Valid until */}
                    <Grid2 size={2}>
                      <Field
                        name="validUntil"
                        validate={(value, allValues) => validateValidUntil(value, allValues as formValues)}
                      >
                        {({ input, meta }) => (
                          <TextField
                            {...input}
                            margin="normal"
                            label={t('admin_panel.costcentre.valid_until')}
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ width: '360px' }}
                            error={meta.error && meta.touched}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                    </Grid2>
                  </Grid2>
                </Grid2>

                {/* Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button variant="outlined" onClick={onClose}>
                    {t('edit_position.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ ml: 2, backgroundColor: '#223B7C', color: 'white' }}
                    disabled={submitting || pristine || hasValidationErrors}
                  >
                    {t('edit_position.save')}
                  </Button>
                </Box>
              </form>
            )}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateCostcentreModal;
