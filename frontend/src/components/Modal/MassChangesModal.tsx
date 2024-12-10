import { Autocomplete, Box, Button, Grid2, IconButton, Modal, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useGetPositionNamesQuery } from 'redux/api-slices/functions/position-names-api';
import { useGetOrganizationTreesQuery } from 'redux/api-slices/functions/organization-trees-api';
import { skipToken } from '@reduxjs/toolkit/query';
import type { Position } from 'models/Position';
import { useUpdatePositionMutation } from 'redux/api-slices/functions/positions-api';

interface MassChangesModalProps {
  open: boolean;
  handleClose: () => void;
  selectedRows: Position[];
}

interface FormValues {
  newValue?: { id: string; label: string } | string; // For orgTreeId or positionName
  decisionNumber?: string;
}

const MassChangesModal: React.FC<MassChangesModalProps> = ({ open, handleClose, selectedRows }) => {
  const { t } = useTranslation();

  const options = [
    { label: t('create_position.organization_tree'), value: 'orgTreeId' },
    { label: t('create_position.position_name'), value: 'positionName' },
    { label: t('create_position.pricing_id'), value: 'pricingId' },
    { label: t('create_position.education_level'), value: 'educationLevel' },
    { label: t('create_position.work_experience'), value: 'workExperience' },
  ];

  const { data: positionNames = [], isLoading: positionNamesLoading } = useGetPositionNamesQuery(
    open ? undefined : skipToken,
  );
  const { data: organizationTrees = [] } = useGetOrganizationTreesQuery(open ? undefined : skipToken);
  const positionNameOptions = positionNames.map((option) => option.name);
  const filteredOrgTrees = organizationTrees
    .filter((tree) => tree.alue === 'KUSTANNUSPAIKKA')
    .sort((a, b) => a.number.localeCompare(b.number));

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
          positionName: position.positionName?.name ? { name: position.positionName.name } : undefined,
          orgTreeId: position.orgTreeId,
          pricingId: position.pricingId,
          vacancySize: position.vacancySize || undefined,
          educationLevel: position.educationLevel,
          workExperience: position.workExperience,
          details: position.details,
          type: position.type,
          decisionNumber: values.decisionNumber,
        };

        // Override the specific field with the new value
        if (selectedOption === 'orgTreeId' && typeof values.newValue === 'object' && values.newValue !== null) {
          updateData.orgTreeId = values.newValue.id;
        } else if (selectedOption === 'positionName' && typeof values.newValue === 'string') {
          updateData.positionName = { name: values.newValue };
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
                        selectedOption === 'positionName' || selectedOption === 'orgTreeId' ? (
                          <Autocomplete
                            {...input}
                            loading={positionNamesLoading}
                            options={
                              selectedOption === 'positionName'
                                ? positionNameOptions
                                : filteredOrgTrees.map((tree) => ({
                                    id: tree.id,
                                    label: `${tree.number} ${tree.name}`,
                                  }))
                            }
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
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
                                  selectedOption === 'positionName'
                                    ? 'create_position.position_name'
                                    : 'create_position.organization_tree',
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
                  <Grid2 size={12}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('edit_position.creation_description')}
                    </Typography>
                    <Field name="creationDescription">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          multiline
                          maxRows={4}
                          label={t('edit_position.creation_description')}
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
