import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  TextField,
  Button,
  Grid2,
  IconButton,
  Typography,
  InputAdornment,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  ListItemText,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { Form, Field } from 'react-final-form';
import CloseIcon from '@mui/icons-material/Close';
import type { Position } from 'models/Position';
import { useTranslation } from 'react-i18next';
import { useGetPositionNamesQuery } from 'redux/api-slices/functions/position-names-api';
/* import { useGetOrganizationTreesQuery } from 'redux/api-slices/functions/organization-trees-api'; */
import { useGetTeacherSubjectsQuery } from 'redux/api-slices/functions/teachersubject-api';
import { useGetCostCentersQuery } from 'redux/api-slices/functions/costcentre-api';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCreatePositionMutation } from 'redux/api-slices/functions/positions-api';
import { useState } from 'react';
import { useEffect } from 'react';
import { checkCostCentreActiveStatus } from 'utils/checkCostCentreActiveStatus';

interface CreateVirkaModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateVirkaModal: React.FC<CreateVirkaModalProps> = ({ open, handleClose }) => {
  const { t } = useTranslation();

  const { data: positionNames = [], isLoading: positionNamesLoading } = useGetPositionNamesQuery(
    open ? undefined : skipToken,
  );
  const { data: costcentres = [], isLoading: costcentresLoading } = useGetCostCentersQuery(
    open ? undefined : skipToken,
  );
  const { data: subjects = [], isLoading: subjectsLoading } = useGetTeacherSubjectsQuery(open ? undefined : skipToken);

  const activeSubjectNames = subjects
    .filter((subject) => subject.active === true)
    .map((subject) => subject.subjectName);

  const [createPosition] = useCreatePositionMutation();

  const [isTeacherPosition, setIsTeacherPosition] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleTeacherPositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTeacherPosition(event.target.checked);
    if (!event.target.checked) {
      setSelectedSubjects([]);
    }
  };

  const selectedSubjectIds = isTeacherPosition
    ? selectedSubjects
        .map((subjectName) => {
          const subject = subjects.find((s) => s.subjectName === subjectName);
          return subject ? subject.id : null;
        })
        .filter((id) => id !== null)
    : [];

  const handleSubjectChange = (event: SelectChangeEvent<typeof selectedSubjects>) => {
    const { value } = event.target;
    setSelectedSubjects(typeof value === 'string' ? value.split(',') : value);
  };

  const validatePricingId = (value: string) => {
    if (value && value.length > 20) {
      return t('error.pricing_id_error');
    }
    return undefined;
  };

  const validateVacancySize = (value: string) => {
    if (value == null || value === '') {
      return undefined; // Allow empty string
    }
    if (!/^\d+$/.test(value)) {
      return t('error.vacancy_size_integer_error');
    }
    const numValue = Number(value);
    if (numValue < 0 || numValue > 100) {
      return t('error.vacancy_size_error');
    }
    return undefined;
  };

  const isCostcentreActive = (costCentre: { validFrom?: string; validUntil?: string }): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const validFrom = costCentre.validFrom ? new Date(costCentre.validFrom) : null;
    const validUntil = costCentre.validUntil ? new Date(costCentre.validUntil) : null;

    return (!validFrom || validFrom <= today) && (!validUntil || validUntil >= today);
  };

  useEffect(() => {
    if (!open) {
      setIsTeacherPosition(false);
      setSelectedSubjects([]);
    }
  }, [open]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    try {
      const positionData: Position = {
        createdAt: new Date(values.createdAt || ''),
        endedAt: undefined,
        vacancySize: Number(values.vacancySize) / 100,
        vacancyFill: Number(values.vacancyFill) / 100,
        creationDecisionNumber: values.creationDecisionNumber ?? '',
        endingDecisionNumber: values.endingDecisionNumber,
        type: values.type ?? 99,
        pricingId: values.pricingId ?? '',
        positionNameId: values.positionNameId.id ?? '',
        educationLevel: values.educationLevel ?? '',
        workExperience: values.workExperience ?? '',
        details: values.details ?? '',
        placementLocation: values.placementLocation ?? '',
        costcentreId: values.costcentreId.id ?? '',
        vacancyStatus: 1,
        isTeacher: isTeacherPosition,
        subjectIds: isTeacherPosition ? selectedSubjectIds : [],
      };

      createPosition(positionData);
      handleClose();
    } catch (error) {
      console.error(error);
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
          maxWidth: '1500px',
          maxHeight: '90vh',
          overflow: 'auto',
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
          <Typography variant="h6">{t('create_position.add_new_position')}</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 4 }}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2} size={12}>
                  <Grid2 size={4}>
                    <Field name="positionNameId">
                      {({ input }) => (
                        <Autocomplete
                          options={[...positionNames].sort((a, b) => a.name.localeCompare(b.name, 'fi'))}
                          loading={positionNamesLoading}
                          getOptionLabel={(option) => option.name}
                          value={input.value || null}
                          onChange={(_, value) => input.onChange(value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              margin="normal"
                              required
                              fullWidth
                              label={t('create_position.position_name')}
                              slotProps={{ inputLabel: { shrink: true } }}
                            />
                          )}
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Field name="createdAt">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          id="createdAt"
                          label={t('create_position.created_at')}
                          type="date"
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Field name="creationDecisionNumber">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          id="creationDecisionNumber"
                          label={t('create_position.creation_decision_number')}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Field name="vacancySize" validate={validateVacancySize}>
                      {({ input, meta }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          id="vacancySize"
                          label={t('create_position.vacancy_size')}
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
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Field name="pricingId" validate={validatePricingId}>
                      {({ input, meta }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          id="pricingId"
                          label={t('create_position.pricing_id')}
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

                  <Grid2 size={4}>
                    <Field name="costcentreId">
                      {({ input }) => (
                        <Autocomplete
                          {...input}
                          options={[...costcentres].filter(isCostcentreActive).sort((a, b) => a.number - b.number)}
                          loading={costcentresLoading}
                          getOptionLabel={(option) =>
                            option
                              ? `${option.number} ${checkCostCentreActiveStatus(option, t('create_position.not_active_suffix'))}`
                              : ''
                          }
                          onChange={(_event, value) => {
                            input.onChange(value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              margin="normal"
                              required
                              fullWidth
                              id="costcentreId"
                              label={t('create_position.costcentre')}
                              sx={{
                                '& input[type="search"]::-webkit-search-cancel-button': {
                                  WebkitAppearance: 'none',
                                },
                              }}
                              slotProps={{
                                input: {
                                  ...params.InputProps,
                                  type: 'search',
                                },
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

                  <Grid2 size={4}>
                    <Field name="placementLocation">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          id="placementLocation"
                          label={t('create_position.placement_location')}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Field name="type">
                      {({ input }) => (
                        <FormControl fullWidth margin="normal">
                          <InputLabel shrink={true} id="type">{`${t('create_position.type')} *`}</InputLabel>
                          <Select
                            required
                            id="type"
                            value={input.value || ''}
                            onChange={(event) => input.onChange(event.target.value)}
                            label={t('create_position.type')}
                            displayEmpty
                          >
                            <MenuItem value={1}>{t('create_position.type_position')}</MenuItem>
                            <MenuItem value={2}>{t('create_position.type_post')}</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                  </Grid2>

                  {isTeacherPosition && (
                    <Grid2 size={4}>
                      <Field name="subjects">
                        {({ input }) => (
                          <FormControl fullWidth margin="normal">
                            <InputLabel shrink={true} id="subjects">{`${t('create_position.subjects')}`}</InputLabel>
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
                              label={t('create_position.subjects')}
                              displayEmpty
                              disabled={subjectsLoading}
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
                </Grid2>

                <Grid2 size={2}>
                  <FormControlLabel
                    control={<Checkbox checked={isTeacherPosition} onChange={handleTeacherPositionChange} />}
                    label={t('create_position.teacher')}
                  />
                </Grid2>

                <Accordion sx={{ mt: 2, mb: 2 }} defaultExpanded>
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
                    <Typography sx={{ color: 'white', fontSize: '1.0rem', fontWeight: 'bold', textTransform: 'none' }}>
                      {t('eligibility')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      padding: '16px',
                      backgroundColor: alpha('#FFFFF', 1),
                    }}
                  >
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
                            label={t('create_position.education_level')}
                            slotProps={{
                              inputLabel: {
                                shrink: true,
                              },
                            }}
                          />
                        )}
                      </Field>
                    </Grid2>
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
                            label={t('create_position.work_experience')}
                            slotProps={{
                              inputLabel: {
                                shrink: true,
                              },
                            }}
                          />
                        )}
                      </Field>
                    </Grid2>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ mt: 2, mb: 4 }} defaultExpanded>
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
                    <Typography sx={{ color: 'white', fontSize: '1.0rem', fontWeight: 'bold', textTransform: 'none' }}>
                      {t('additional_details')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      padding: '16px',
                      backgroundColor: alpha('#FFFFF', 1),
                    }}
                  >
                    <Grid2 size={12}>
                      <Field name="details">
                        {({ input }) => (
                          <TextField
                            {...input}
                            margin="normal"
                            fullWidth
                            multiline
                            maxRows={4}
                            id="additionalDetails"
                            label={t('additional_details')}
                            slotProps={{
                              inputLabel: {
                                shrink: true,
                              },
                            }}
                          />
                        )}
                      </Field>
                    </Grid2>
                  </AccordionDetails>
                </Accordion>

                <Grid2 sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" disabled={submitting || pristine}>
                    {t('create_position.save')}
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

export default CreateVirkaModal;
