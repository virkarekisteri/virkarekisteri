import React from 'react';
import type { SelectChangeEvent } from '@mui/material';
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
  FormControlLabel,
  Checkbox,
  Chip,
  ListItemText,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import type { Position } from 'models/Position';
import { useGetPositionNamesQuery } from 'redux/api-slices/functions/position-names-api';
import { useUpdatePositionMutation } from 'redux/api-slices/functions/positions-api';
import { useGetCostCentersQuery } from 'redux/api-slices/functions/organization-trees-api';
import { useEffect, useState } from 'react';
import { useGetSubjectsQuery } from 'redux/api-slices/functions/subjects';
import { skipToken } from '@reduxjs/toolkit/query';

interface ModifyVirkaModalProps {
  open: boolean;
  handleClose: () => void;
  position: Position;
}

interface FormValues {
  endedAt?: Date;
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
  decisionNumber?: string;
}

const ModifyVirkaModal: React.FC<ModifyVirkaModalProps> = ({ open, handleClose, position }) => {
  const { t } = useTranslation();

  const { data: positionNames = [] } = useGetPositionNamesQuery();
  const { data: organizationTrees = [] } = useGetCostCentersQuery();

  const { data: subjects = [] } = useGetSubjectsQuery(open ? undefined : skipToken);

  const [updatePosition] = useUpdatePositionMutation();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isTeacherPosition, setIsTeacherPosition] = useState(false);

  useEffect(() => {
    if (subjects.length > 0 && position.subjectIds && position.subjectIds.length > 0) {
      const subjectNames = position.subjectIds
        .map((subjectId) => {
          const matchedSubject = subjects.find((s) => s.id === subjectId);
          return matchedSubject ? matchedSubject.subjectName : null;
        })
        .filter((subjectName): subjectName is string => subjectName !== null);

      setSelectedSubjects(subjectNames);
    }
    setIsTeacherPosition(position.isTeacher || false);
  }, [subjects, position.subjectIds, position.isTeacher]);

  const activeSubjectNames = subjects
    .filter((subject) => subject.active === true)
    .map((subject) => subject.subjectName);

  const handleSubjectChange = (event: SelectChangeEvent<typeof selectedSubjects>) => {
    const { value } = event.target;
    setSelectedSubjects(typeof value === 'string' ? value.split(',') : value);
  };

  const subjectIds = isTeacherPosition
    ? selectedSubjects
        .map((subjectName) => subjects.find((s) => s.subjectName === subjectName)?.id)
        .filter((id): id is string => id !== undefined)
    : undefined;

  const filteredOrgTrees = organizationTrees;

  const validatePricingId = (value: string) => {
    if (value && value.length > 20) {
      return t('error.pricing_id_error');
    }
    return undefined;
  };

  const validateVacancySize = (value: string) => {
    if (!/^\d+$/.test(value)) {
      return t('error.vacancy_size_integer_error');
    }
    const numValue = Number(value);
    if ((value && numValue < 0) || numValue > 100) {
      return t('error.vacancy_size_error');
    }
    return undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateVacancyFill = (value: string, allValues: Record<string, any>) => {
    if ((value && Number(value) < 0) || Number(value) > 100) {
      return t('error.vacancy_fill_error');
    } else if (Number(value) > Number(allValues.vacancySize)) {
      return t('error.vacancy_fill_greater_than_size');
    }
    return undefined;
  };

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
        positionName: values.positionName ? { name: values.positionName.name } : undefined,
        costcentreId: values.orgTree,
        pricingId: values.pricingId,
        vacancySize: values.vacancySize ? values.vacancySize / 100 : undefined, // Convert percentage to decimal
        educationLevel: values.educationLevel,
        workExperience: values.workExperience,
        details: values.details,
        type: values.type,
        decisionNumber: values.decisionNumber,
        isTeacher: isTeacherPosition,
        subjectIds: subjectIds,
      };
      updatePosition({ id: position.id, position: updateData });
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
              vacancySize: (Number(position.vacancySize) * 100).toFixed(),
              vacancyFill: (Number(position.vacancyFill) * 100).toFixed(),
              positionName: position.positionName,
              orgTree: position.costcentreId,
              placementLocation: position.placementLocation,
              pricingId: position.pricingId,
              educationLevel: position.educationLevel,
              workExperience: position.workExperience,
              details: position.details,
              vacancyNumber: position.vacancyNumber,
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
                      <Field name="positionName">
                        {({ input }) => (
                          <Autocomplete
                            freeSolo
                            options={positionNames.map((option) => option.name)}
                            value={input.value?.name || ''}
                            onInputChange={(_event, value) => {
                              input.onChange({ name: value });
                            }}
                            onChange={(_event, value) => {
                              if (typeof value === 'string') {
                                input.onChange({ name: value });
                              } else if (value) {
                                input.onChange({ name: value });
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                required
                                label={t('edit_position.position_name')}
                                placeholder={t('edit_position.position_name')}
                                slotProps={{
                                  inputLabel: {
                                    shrink: true,
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      </Field>
                    </Grid2>
                  </Grid2>

                  {/* Organization Tree */}
                  <Grid2 size={6}>
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
                                filteredOrgTrees.find((tree) => tree.id === position.costcentreId)
                                  ? `${filteredOrgTrees.find((tree) => tree.id === position.costcentreId)?.number} ${filteredOrgTrees.find((tree) => tree.id === position.costcentreId)?.name}`
                                  : t('edit_position.organization_tree')
                              }
                              slotProps={{
                                inputLabel: {
                                  shrink: true,
                                },
                              }}
                            />
                          )}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Placement Location */}
                  <Grid2 size={6}>
                    <Field name="placementLocation">
                      {({ input }) => (
                        <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          placeholder={position.placementLocation}
                          label={t('edit_position.placement_location')}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Type */}
                  <Grid2 size={6}>
                    <Field name="type">
                      {({ input }) => (
                        <FormControl fullWidth margin="normal">
                          <InputLabel shrink={true} id="type-select-label">
                            {t('edit_position.type')} *
                          </InputLabel>
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
                    <Field name="pricingId" validate={validatePricingId}>
                      {({ input, meta }) => (
                        <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          placeholder={position.pricingId}
                          label={t('edit_position.pricing_id')}
                          error={meta.error && meta.touched}
                          helperText={meta.touched && meta.error}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Vacancy Size */}
                  <Grid2 size={6}>
                    <Field name="vacancySize" validate={validateVacancySize}>
                      {({ input, meta }) => (
                        <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          type="number"
                          error={meta.error && meta.touched}
                          helperText={meta.touched && meta.error ? meta.error : ''}
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="start">%</InputAdornment>,
                              inputProps: { min: 0, max: 100 },
                            },
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          placeholder={(position.vacancySize ? position.vacancySize * 100 : 0).toFixed()}
                          label={t('edit_position.vacancy_size')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Vacancy Fill */}
                  <Grid2 size={6}>
                    <Field name="vacancyFill" validate={validateVacancyFill}>
                      {({ input, meta }) => (
                        <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          type="number"
                          error={meta.error && meta.touched}
                          helperText={meta.touched && meta.error}
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="start">%</InputAdornment>,
                              inputProps: { min: 0, max: 100 },
                            },
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          placeholder={(position.vacancyFill ? position.vacancyFill * 100 : 0).toFixed()}
                          label={t('edit_position.vacancy_fill')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Is teacher checkbox */}
                  <Grid2 size={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isTeacherPosition}
                          onChange={() => {
                            if (isTeacherPosition) {
                              setSelectedSubjects([]);
                            }
                            setIsTeacherPosition(!isTeacherPosition);
                          }}
                        />
                      }
                      label={t('edit_position.teacher')}
                    />
                  </Grid2>

                  {/* Subjects if teacher */}
                  {isTeacherPosition && (
                    <Grid2 size={6}>
                      <Field name="subjects">
                        {({ input }) => (
                          <FormControl fullWidth margin="normal">
                            <InputLabel shrink={true} id="subjects">{`${t('edit_position.subjects')}`}</InputLabel>
                            <Select
                              {...input}
                              multiple
                              value={selectedSubjects}
                              onChange={handleSubjectChange}
                              renderValue={(selected) => (
                                <div>
                                  {selected.map((subject) => (
                                    <Chip key={subject} label={subject} sx={{ marginRight: 1, maxHeight: 20 }} />
                                  ))}
                                </div>
                              )}
                              label={t('edit_position.subjects')}
                              displayEmpty
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 400,
                                  },
                                },
                              }}
                            >
                              {activeSubjectNames.sort().map((subject) => (
                                <MenuItem key={subject} value={subject}>
                                  <Checkbox checked={selectedSubjects.includes(subject)} />
                                  <ListItemText primary={subject} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </Field>
                    </Grid2>
                  )}

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
                          placeholder={position.educationLevel}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Work Experience */}
                  <Grid2 size={12}>
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
                          placeholder={position.workExperience}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Additional Details */}
                  <Grid2 size={12}>
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
                          placeholder={position.details}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
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
                      <Field name="decisionNumber">
                        {({ input }) => (
                          <TextField
                            {...input}
                            margin="normal"
                            required
                            fullWidth
                            id="decisionNumber"
                            label={t('edit_position.creation_decision_number')}
                            slotProps={{
                              inputLabel: {
                                shrink: true,
                              },
                            }}
                          />
                        )}
                      </Field>
                    </Grid2>
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
