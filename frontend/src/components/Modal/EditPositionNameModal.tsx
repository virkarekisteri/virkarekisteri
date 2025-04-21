import React from 'react';
import { Box, TextField, Button, Grid2, IconButton, Typography } from '@mui/material';

import RenderReadonlyTextField from 'components/Details/RenderReadonlyTextField';

import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

import type { PositionName } from 'models/PositionName';
import { useUpdatePositionNameMutation } from 'redux/api-slices/functions/position-names-api';
import { useCreatePositionNameMutation } from 'redux/api-slices/functions/position-names-api';

interface EditPositionNameModalProps {
  open: boolean;
  handleClose: () => void;
  submitCallback: () => void;
  positionName: PositionName | undefined;
  allPositionNames: PositionName[];
}

interface FormValues {
  name: string;
  validFrom?: string;
  validUntil?: string;
}

const EditPositionNameModal: React.FC<EditPositionNameModalProps> = ({
  open,
  handleClose,
  submitCallback,
  positionName,
  allPositionNames,
}) => {
  const isCreateDialog: boolean = positionName === undefined ? true : false;

  const { t } = useTranslation();

  const [updateSubject] = useUpdatePositionNameMutation();
  const [createSubject] = useCreatePositionNameMutation();

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

  const initialValues: Partial<PositionName> =
    positionName !== undefined
      ? {
          name: positionName.name,
          validFrom: formatDateForInput(positionName.validFrom),
          validUntil: formatDateForInput(positionName.validUntil),
        }
      : {
          name: '',
          validFrom: '',
          validUntil: '',
        };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatePositionName = (value: string, /* allValues: Record<string, any> */) => {
    if (
      value &&
      allPositionNames.some((posName) => {
        return posName.name === value.toLowerCase() && (isCreateDialog || (positionName && value != positionName.name));
      })
    )
      return t('admin_panel.position_name.validation.duplicate_name');

    return undefined;
  };

  // Checks whether the valid from date is before the valid until date
  const validateValidUntil = (value: string, allValues: FormValues) => {
    if (allValues.validFrom && value) {
      const validFromDate = new Date(allValues.validFrom);
      const validUntilDate = new Date(value);
      if (validUntilDate <= validFromDate) {
        return t('admin_panel.position_name.validation.invalid_date');
      }
    }
    return undefined;
  };

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    if (!positionName || !positionName.id) {
      // create new position name
      try {
        const subjectData: Partial<PositionName> = {
          name: values.name.toLowerCase(),
          validFrom: values.validFrom ? new Date(values.validFrom).toISOString().split('T')[0] : undefined,
          validUntil: values.validUntil ? new Date(values.validUntil).toISOString().split('T')[0] : undefined,
        };
        console.log('Creating new position name!');
        createSubject(subjectData);
        submitCallback();
        //handleClose();
        return;
      } catch (error) {
        console.error('Failed to create position name:', error);
      }
    } else {
      // edit existing position name
      try {
        const updateData = {
          name: values.name.toLowerCase(),
          validFrom: values.validFrom ? new Date(values.validFrom).toISOString().split('T')[0] : undefined,
          validUntil: values.validUntil ? new Date(values.validUntil).toISOString().split('T')[0] : undefined,
        };
        console.log(updateData);
        updateSubject({ id: positionName.id, data: updateData });
        submitCallback();
        //handleClose();
      } catch (error) {
        console.error('Failed to update position name:', error);
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '800px',
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
          <Typography variant="h6">
            {isCreateDialog ? t('admin_panel.position_name.create_new') : t('admin_panel.position_name.edit')}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
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
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#223b7c' }}>
                      {t('admin_panel.position_name.details')}
                    </Typography>
                  </Box>
                  {isCreateDialog || <RenderReadonlyTextField value={t('admin_panel.position_name.edit_warning')} />}
                  {/* Name */}
                  <Grid2 size={12}>
                    <Field name="name" validate={validatePositionName}>
                      {({ input, meta }) => {
                        //console.log(input)
                        return (
                          <TextField
                            {...input}
                            fullWidth
                            margin="normal"
                            placeholder={initialValues.name}
                            label={t('admin_panel.position_name.name')}
                            error={meta.error && meta.touched}
                            helperText={meta.touched && meta.error}
                            slotProps={{
                              inputLabel: {
                                shrink: true,
                              },
                            }}
                          />
                        );
                      }}
                    </Field>
                  </Grid2>
                </Grid2>

                {/* Valid from */}
                <Grid2 size={2} sx={{ display: 'flex', gap: 2 }}>
                  <Field name="validFrom">
                    {({ input, meta }) => (
                      <TextField
                        {...input}
                        margin="normal"
                        label={t('admin_panel.position_name.valid_from')}
                        type="date"
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{ width: '360px' }}
                        error={meta.error && meta.touched}
                        helperText={meta.touched && meta.error}
                      />
                    )}
                  </Field>

                  {/* Valid until */}

                  <Field
                    name="validUntil"
                    validate={(value, allValues) => validateValidUntil(value, allValues as FormValues)}
                  >
                    {({ input, meta }) => (
                      <TextField
                        {...input}
                        margin="normal"
                        label={t('admin_panel.position_name.valid_until')}
                        type="date"
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{ width: '360px' }}
                        error={meta.error && meta.touched}
                        helperText={meta.touched && meta.error}
                      />
                    )}
                  </Field>
                </Grid2>

                {/* Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button variant="outlined" onClick={handleClose}>
                    {t('edit_position.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: '#223B7C', color: 'white', ml: 2 }}
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

export default EditPositionNameModal;
