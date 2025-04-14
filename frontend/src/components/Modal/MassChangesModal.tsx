import { Autocomplete, Box, Button, Grid2, IconButton, Modal, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useGetPositionNamesQuery } from 'redux/api-slices/functions/position-names-api';
import { useGetCostCentersQuery } from 'redux/api-slices/functions/costcentre-api';
import { skipToken } from '@reduxjs/toolkit/query';
import type { Position } from 'models/Position';
import { useUpdatePositionMutation } from 'redux/api-slices/functions/positions-api';

interface MassChangesModalProps {
  open: boolean;
  handleClose: () => void;
  selectedRows: Position[];
}

interface FormValues {
  newValue?: { id: string; label: string } | string; // For costcentreId or positionNameId
  decisionNumber?: string;
}

const MassChangesModal: React.FC<MassChangesModalProps> = ({ open, handleClose, selectedRows }) => {
  const { t } = useTranslation();

  const options = [
    { label: t('create_position.costcentre'), value: 'costcentreId' },
    { label: t('create_position.position_name'), value: 'positionNameId' },
    { label: t('create_position.pricing_id'), value: 'pricingId' },
    { label: t('create_position.education_level'), value: 'educationLevel' },
    { label: t('create_position.work_experience'), value: 'workExperience' },
  ];

  const { data: positionNames = [], isLoading: positionNamesLoading } = useGetPositionNamesQuery(
    open ? undefined : skipToken,
  );
  const { data: costcentres = [], isLoading: costcentresLoading } = useGetCostCentersQuery(
    open ? undefined : skipToken,
  );

  const isCostcentreActive = (costCentre: { validFrom?: string; validUntil?: string }): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const validFrom = costCentre.validFrom ? new Date(costCentre.validFrom) : null;
    const validUntil = costCentre.validUntil ? new Date(costCentre.validUntil) : null;

    return (!validFrom || validFrom <= today) && (!validUntil || validUntil >= today);
  };
  

  const [updatePosition] = useUpdatePositionMutation();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    if (!selectedOption) {
      console.error('No field selected for update');
      return;
    }

    try {
      const validPositions = selectedRows.filter((position) => position?.id);

      const updatePromises = validPositions.map(async (position) => {
        const updateData = {
          endedAt: position.endedAt,
          endingDecisionNumber: position.endingDecisionNumber,
          placementLocation: position.placementLocation,
          vacancyFill: position.vacancyFill || undefined,
          positionNameId: position.positionNameId,
          costcentreId: position.costcentreId,
          pricingId: position.pricingId,
          vacancySize: position.vacancySize || undefined,
          educationLevel: position.educationLevel,
          workExperience: position.workExperience,
          details: position.details,
          type: position.type,
          decisionNumber: values.decisionNumber,
        };

        // Override the specific field with the new value
        if (selectedOption === 'costcentreId' && typeof values.newValue === 'object' && values.newValue !== null) {
          updateData.costcentreId = values.newValue.id;
        } else if (
          selectedOption === 'positionNameId' &&
          typeof values.newValue === 'object' &&
          values.newValue !== null
        ) {
          updateData.positionNameId = values.newValue.id;
        } else if (selectedOption === 'pricingId' && typeof values.newValue === 'string') {
          updateData.pricingId = values.newValue;
        } else if (selectedOption === 'educationLevel' && typeof values.newValue === 'string') {
          updateData.educationLevel = values.newValue;
        } else if (selectedOption === 'workExperience' && typeof values.newValue === 'string') {
          updateData.workExperience = values.newValue;
        }

        try {
          await updatePosition({ id: position.id!, position: updateData });
        } catch (error) {
          console.error(`Failed to update position ${position.id}:`, error);
          throw error;
        }
      });
      await Promise.all(updatePromises);
      handleClose();
    } catch (error) {
      console.error('Unexpected error in onSubmit:', error);
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
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 0,
          borderRadius: 1,
        }}
      >
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
          <Typography variant="h6">{t('mass_changes.make_changes')}</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 4 }}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <Grid2>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('mass_changes.edit_field')}
                    </Typography>
                    <Autocomplete
                      options={options}
                      getOptionLabel={(option) => option.label}
                      id="auto-complete"
                      autoComplete
                      includeInputInList
                      onChange={(_event, newValue) => {
                        setSelectedOption(newValue?.value || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="normal"
                          required
                          fullWidth
                          id="positionName"
                          label={t('mass_changes.field_type')}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('mass_changes.new_value')}
                    </Typography>
                    <Field name="newValue">
                      {({ input }) =>
                        selectedOption === 'positionNameId' || selectedOption === 'costcentreId' ? (
                          <Autocomplete
                            {...input}
                            options={
                              selectedOption === 'positionNameId'
                                ? positionNames.map((tree) => ({
                                    id: tree.id,
                                    label: `${tree.name}`,
                                  }))
                                : costcentres
                                  .filter(isCostcentreActive)
                                  .map((tree) => ({
                                    id: tree.id,
                                    label: `${tree.number} ${tree.name}`,
                                  }))
                            }
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
                            loading={selectedOption === 'positionNameId' ? positionNamesLoading : costcentresLoading}
                            onChange={(_event, value) => {
                              input.onChange(value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                margin="normal"
                                required
                                fullWidth
                                label={t(
                                  selectedOption === 'positionNameId'
                                    ? 'create_position.position_name'
                                    : 'create_position.costcentre',
                                )}
                              />
                            )}
                          />
                        ) : (
                          <TextField
                            {...input}
                            margin="normal"
                            required
                            fullWidth
                            label={t('mass_changes.new_value')}
                          />
                        )
                      }
                    </Field>
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2} marginTop={1}>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('edit_position.creation_decision_number')}
                    </Typography>
                    <Field name="decisionNumber">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          label={t('edit_position.creation_decision_number')}
                        />
                      )}
                    </Field>
                  </Grid2>
                </Grid2>
                <Grid2 container justifyContent="flex-end" marginTop={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: '#223B7C' }}
                    disabled={submitting || pristine || !selectedOption}
                  >
                    {t('mass_changes.make_change')}
                  </Button>
                </Grid2>
              </form>
            )}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default MassChangesModal;
