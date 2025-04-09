import { Box, Grid2, IconButton, Modal, Typography, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Form, Field } from 'react-final-form';
import { useGetCostCentersQuery, useUpdateCostCentreMutation } from 'redux/api-slices/functions/costcentre-api';
import type { Costcentre } from 'models/Costcentre';
import RenderReadonlyTextField from 'components/Details/RenderReadonlyTextField';

interface EditCostcentreModalProps {
  open: boolean;
  onClose: () => void;
  costcentre: Costcentre;
  onSubmitSuccess?: () => void;
}

interface FormValues {
  number: string;
  name: string;
  validFrom?: string;
  validUntil?: string;
}

const EditCostcentreModal: React.FC<EditCostcentreModalProps> = ({ open, onClose, costcentre, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const [updateCostcentre] = useUpdateCostCentreMutation();
  const { data: costcentres } = useGetCostCentersQuery();

  // Formats the date for the input field
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Initial values for the form
  const initialValues: FormValues = {
    number: costcentre.number.toString(),
    name: costcentre.name,
    validFrom: formatDateForInput(costcentre.validFrom),
    validUntil: formatDateForInput(costcentre.validUntil),
  };

  const onSubmit = async (values: any) => {
    try {
      const updatedData = {
        number: parseInt(values.number),
        name: values.name,
        validFrom: values.validFrom ? new Date(values.validFrom).toISOString().split('T')[0] : undefined,
        validUntil: values.validUntil ? new Date(values.validUntil).toISOString().split('T')[0] : undefined,
      };

      await updateCostcentre({
        id: costcentre.id,
        costcentre: updatedData,
      });

      onClose();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Failed to update costcentre:', error);
    }
  };

  // Checks whether the costcentre number is valid and not already in use
  const validateCostcentreNumber = (value: string) => {
    if (value === costcentre.number.toString()) {
      return undefined;
    }
    if (!value) {
      return t('admin_panel.costcentre.validation.required');
    }
    if (isNaN(Number(value))) {
      return t('admin_panel.costcentre.validation.invalid_number');
    }
    if (costcentres?.some((c) => c.number.toString() === value)) {
      return t('admin_panel.costcentre.validation.duplicate_number');
    }
    if (value.length > 4) {
      return t('admin_panel.costcentre.validation.invalid_number');
    }
    return undefined;
  };

  // Checks whether the costcentre name is valid and not already in use
  const validateCostcentreName = (value: string) => {
    if (value === costcentre.name) {
      return undefined;
    }
    if (!value) {
      return t('admin_panel.costcentre.validation.required');
    }
    if (costcentres?.some((c) => c.name === value)) {
      return t('admin_panel.costcentre.validation.duplicate_name');
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
          <Typography variant="h6">{t('admin_panel.costcentre.edit')}</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4, pt: 0 }}>
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            render={({ handleSubmit, submitting, pristine, hasValidationErrors }) => (
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2} size={12}>
                  {/* Subtitle */}
                  <Box sx={{ px: 2, mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#223B7C' }}>
                      {t('admin_panel.costcentre.details')}
                    </Typography>
                  </Box>
                  <RenderReadonlyTextField value={t('admin_panel.costcentre.edit_warning')} />

                  <Grid2 size={12} sx={{ display: 'flex', gap: 2 }}>
                    {/* Number */}
                    <Grid2 size={1}>
                      <Field name="number" validate={validateCostcentreNumber}>
                        {({ input, meta }) => (
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
                        )}
                      </Field>
                    </Grid2>

                    {/* Name */}
                    <Grid2 size={2}>
                      <Field name="name" validate={validateCostcentreName}>
                        {({ input, meta }) => (
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
                        )}
                      </Field>
                    </Grid2>
                  </Grid2>

                  <Grid2 size={12} sx={{ display: 'flex', gap: 2 }}>
                    {/* Valid from */}
                    <Grid2 size={2}>
                      <Field name="validFrom">
                        {({ input }) => (
                          <TextField
                            {...input}
                            margin="normal"
                            label={t('admin_panel.costcentre.valid_from')}
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ width: '360px' }}
                          />
                        )}
                      </Field>
                    </Grid2>

                    {/* Valid until */}
                    <Grid2 size={2}>
                      <Field name="validUntil">
                        {({ input }) => (
                          <TextField
                            {...input}
                            margin="normal"
                            label={t('admin_panel.costcentre.valid_until')}
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={{ width: '360px' }}
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

export default EditCostcentreModal;
