import React, { useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid2,
  IconButton,
  Typography,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import type { Position } from 'models/Position';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { selectPositionData } from 'redux/slices/position-slice';
import { fetchPositionNames, selectPositionNames } from 'redux/slices/position-name-slice';
import { getOrganizationTrees, selectOrganizationTreeData } from 'redux/slices/organization-tree-slice';
import { getPositions, updatePosition } from 'redux/slices/position-slice';

interface ModifyVirkaModalProps {
  open: boolean;
  handleClose: () => void;
  position: Position;
}

interface FormValues {
  endedAt?: string;
  endingDecisionNumber?: string;
  placementLocation?: string;
  vacancyFill?: number;
  positionName?: { name: string };
  orgTree?: string;
  pricingId?: string;
  vacancySize?: number;
  educationLevel?: string;
  workExperience?: string;
  details?: string;
  type?: number;
}

const ModifyVirkaModal: React.FC<ModifyVirkaModalProps> = ({ open, handleClose, position }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const positionNames = useAppSelector(selectPositionNames);
  const dataFromBackend = useAppSelector(selectPositionData);

  const organizationTrees = useAppSelector(selectOrganizationTreeData);
  const filteredOrgTrees = organizationTrees
    .filter((tree) => tree.alue === 'KUSTANNUSPAIKKA')
    .sort((a, b) => a.number.localeCompare(b.number));

  useEffect(() => {
    if (open) {
      dispatch(fetchPositionNames());
      dispatch(getOrganizationTrees());
    }
  }, [dispatch, open, dataFromBackend]);

  const onSubmit = async (values: FormValues) => {
    if (!position.id) {
      return;
    }

    try {
      const updateData = {
        endedAt: values.endedAt,
        endingDecisionNumber: values.endingDecisionNumber,
        placementLocation: values.placementLocation,
        vacancyFill: values.vacancyFill ? values.vacancyFill / 100 : undefined, // Convert percentage to decimal
        positionName: values.positionName?.name,
        orgTreeId: values.orgTree,
        pricingId: values.pricingId,
        vacancySize: values.vacancySize ? values.vacancySize / 100 : undefined, // Convert percentage to decimal
        educationLevel: values.educationLevel,
        workExperience: values.workExperience,
        details: values.details,
        type: values.type,
      };
      await dispatch(updatePosition({ id: position.id, data: updateData }));
      await dispatch(getPositions());
      handleClose();
    } catch (error) {
      console.error('Failed to update position:', error);
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
          <Typography variant="h6">{t('edit_position.title')}</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4, pt: 0 }}>
          <Form
            onSubmit={onSubmit}
            initialValues={{
              type: position.type,
              vacancySize: Number(position.vacancySize) * 100,
              vacancyFill: Number(position.vacancyFill) * 100,
              positionName: position.positionName,
              orgTree: position.orgTreeId,
              placementLocation: position.placementLocation,
              pricingId: position.pricingId,
              educationLevel: position.educationLevel,
              workExperience: position.workExperience,
              details: position.details,
              vacancyNumber: position.vacancyNumber,
              //creationDecisionNumber: position.creationDecisionNumber, <-- this will be DecisionNumber (Nvarchar)
              //creationDescription: position.creationDescription, <-- this will be DecisionDescription
            }}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2} size={12}>
                  {/* Subtitle */}
                  <Box sx={{ px: 2, mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#223b7c' }}>
                      {t('position.details')}
                    </Typography>
                  </Box>

                  {/* Static Vacancy Number */}
                  <Grid2 size={12}>
                    <Typography component="div" fontWeight="bold">
                      {t('edit_position.vacancy_number')}
                    </Typography>
                    <Typography sx={{ mt: 1 }}>{position.vacancyNumber}</Typography>
                  </Grid2>

                  {/* Position Name */}
                  <Grid2 container spacing={2} size={12} justifyContent="left">
                    <Grid2 size={6}>
                      <Typography component="div" fontWeight="bold">
                        {t('edit_position.position_name')}
                      </Typography>
                      <Field name="positionName">
                        {({ input }) => (
                          <Autocomplete
                            options={positionNames}
                            getOptionLabel={(option) => option.name || ''}
                            value={positionNames.find((option) => option.id === input.value?.id) || null}
                            onChange={(_event, value) => input.onChange(value ? value : null)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                required
                                label={t('edit_position.position_name')}
                                placeholder={position.positionName?.name || t('edit_position.position_name')}
                              />
                            )}
                          />
                        )}
                      </Field>
                    </Grid2>
                  </Grid2>

                  {/* Organization Tree */}
                  <Grid2 size={6}>
                    <Typography component="div" fontWeight="bold">
                      {t('edit_position.organization_tree')}
                    </Typography>
                    <Field name="orgTree">
                      {({ input }) => (
                        <Autocomplete
                          options={filteredOrgTrees}
                          getOptionLabel={(option) => `${option.number} ${option.name}`}
                          value={filteredOrgTrees.find((tree) => tree.id === input.value) || null}
                          onChange={(_event, value) => {
                            input.onChange(value ? value.id : null);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              margin="normal"
                              required
                              label={t('edit_position.organization_tree')}
                              placeholder={
                                filteredOrgTrees.find((tree) => tree.id === position.orgTreeId)
                                  ? `${filteredOrgTrees.find((tree) => tree.id === position.orgTreeId)?.number} ${filteredOrgTrees.find((tree) => tree.id === position.orgTreeId)?.name}`
                                  : t('edit_position.organization_tree')
                              }
                            />
                          )}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Placement Location */}
                  <Grid2 size={6}>
                    <Typography component="div" fontWeight="bold">
                      {t('edit_position.placement_location')}
                    </Typography>
                    <Field name="placementLocation">
                      {({ input }) => (
                        <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          placeholder={position.placementLocation || t('edit_position.placement_location')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Type */}
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('edit_position.type')}
                    </Typography>
                    <Field name="type">
                      {({ input }) => (
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="type-select-label">{t('edit_position.type')} *</InputLabel>
                          <Select
                            required
                            labelId="type-select-label"
                            id="type-select"
                            value={input.value}
                            onChange={(event) => input.onChange(event.target.value)}
                            label={t('edit_position.type')}
                          >
                            <MenuItem value={1}>{t('edit_position.type_position')}</MenuItem>
                            <MenuItem value={2}>{t('edit_position.type_post')}</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                  </Grid2>

                  {/* Pricing ID */}
                  <Grid2 size={6}>
                    <Typography component="div" fontWeight="bold">
                      {t('edit_position.pricing_id')}
                    </Typography>
                    <Field name="pricingId">
                      {({ input }) => (
                        <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          placeholder={position.pricingId || t('edit_position.pricing_id')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Vacancy Size */}
                  <Grid2 size={6}>
                    <Typography component="div" fontWeight="bold">
                      {t('edit_position.vacancy_size')}
                    </Typography>
                    <Field name="vacancySize">
                      {({ input }) => (
                        <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          type="number"
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="start">%</InputAdornment>,
                              inputProps: { min: 0, max: 100 },
                            },
                          }}
                          placeholder={position.vacancySize?.toString() || t('edit_position.vacancy_size')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Vacancy Fill */}
                  <Grid2 size={6}>
                    <Typography component="div" fontWeight="bold">
                      {t('edit_position.vacancy_fill')}
                    </Typography>
                    <Field name="vacancyFill">
                      {({ input }) => (
                        <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          type="number"
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="start">%</InputAdornment>,
                              inputProps: { min: 0, max: 100 },
                            },
                          }}
                          placeholder={position.vacancyFill?.toString() || t('edit_position.vacancy_fill')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Divider */}
                  <Box
                    sx={{
                      height: '2px',
                      backgroundColor: '#223b7c',
                      width: '100%',
                      my: 0,
                    }}
                  />

                  {/* Subtitle */}
                  <Box sx={{ px: 2, mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#223b7c' }}>
                      {t('eligibility')}
                    </Typography>
                  </Box>

                  {/* Education Level */}
                  <Grid2 size={12}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('edit_position.education_level')}
                    </Typography>
                    <Field name="educationLevel">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          multiline
                          maxRows={4}
                          id="educationLevel"
                          label={t('edit_position.education_level')}
                          placeholder={position.educationLevel || t('edit_position.education_level')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Work Experience */}
                  <Grid2 size={12}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('edit_position.work_experience')}
                    </Typography>
                    <Field name="workExperience">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          multiline
                          maxRows={4}
                          id="workExperience"
                          label={t('edit_position.work_experience')}
                          placeholder={position.workExperience || t('edit_position.work_experience')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Additional Details */}
                  <Grid2 size={12}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('additional_details')}
                    </Typography>
                    <Field name="details">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          multiline
                          maxRows={4}
                          id="details"
                          label={t('additional_details')}
                          placeholder={position.details || t('additional_details')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Divider */}
                  <Box
                    sx={{
                      height: '2px',
                      backgroundColor: '#223b7c',
                      width: '100%',
                      my: 0,
                    }}
                  />

                  {/* Subtitle */}
                  <Box sx={{ px: 2, mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#223b7c' }}>
                      {t('edit_position.decision')}
                    </Typography>
                  </Box>

                  {/* Creation decision number */}
                  <Grid2 container spacing={2} size={12} justifyContent="left">
                    <Grid2 size={6}>
                      <Typography component={'div'} fontWeight={'fontWeightBold'}>
                        {t('edit_position.creation_decision_number')}
                      </Typography>
                      <Field name="creationDecisionNumber">
                        {({ input }) => (
                          <TextField
                            {...input}
                            margin="normal"
                            required
                            fullWidth
                            id="creationDecisionNumber"
                            label={t('edit_position.creation_decision_number')}
                          />
                        )}
                      </Field>
                    </Grid2>
                  </Grid2>

                  {/* Creation description */}
                  <Grid2 size={12}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('edit_position.creation_description')}
                    </Typography>
                    <Field name="creation_description">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          multiline
                          maxRows={4}
                          id="creation_description"
                          label={t('edit_position.creation_description')}
                        />
                      )}
                    </Field>
                  </Grid2>
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
                    disabled={submitting || pristine}
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

export default ModifyVirkaModal;
