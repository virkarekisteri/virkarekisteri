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
} from '@mui/material';
import Modal from '@mui/material/Modal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { Form, Field } from 'react-final-form';
import CloseIcon from '@mui/icons-material/Close';
import type { Position } from 'models/Position';
import { useTranslation } from 'react-i18next';
import type { PositionName } from 'models/PositionName';
import { useGetPositionNamesQuery } from 'redux/api-slices/functions/position-names-api';
import { useGetOrganizationTreesQuery } from 'redux/api-slices/functions/organization-trees-api';
import { skipToken } from '@reduxjs/toolkit/query';
import { useCreatePositionMutation } from 'redux/api-slices/functions/positions-api';

interface CreateVirkaModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateVirkaModal: React.FC<CreateVirkaModalProps> = ({ open, handleClose }) => {
  const { t } = useTranslation();

  const { data: positionNames = [], isLoading: positionNamesLoading } = useGetPositionNamesQuery(
    open ? undefined : skipToken,
  );
  const { data: organizationTrees = [] } = useGetOrganizationTreesQuery(open ? undefined : skipToken);

  const [createPosition] = useCreatePositionMutation();

  const positionNameOptions = positionNames.map((option) => option.name);

  const filteredOrgTrees = organizationTrees
    .filter((tree) => tree.alue === 'KUSTANNUSPAIKKA')
    .sort((a, b) => a.number.localeCompare(b.number));

  const validatePricingId = (value: string) => {
    if (value && value.length > 10) {
      return t('error.pricing_id_error');
    }
    return undefined;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    const positionNameObj: PositionName = {
      name: values.positionName?.toString() || '',
    };

    try {
      const positionData: Position = {
        createdAt: new Date(values.createdAt || ''),
        endedAt: values.endedAt ? new Date(values.endedAt) : undefined,
        vacancySize: Number(values.vacancySize) / 100,
        vacancyFill: Number(values.vacancyFill) / 100,
        creationDecisionNumber: values.creationDecisionNumber ?? '',
        endingDecisionNumber: values.endingDecisionNumber,
        type: values.type ?? 99,
        pricingId: values.pricingId ?? '',
        positionName: positionNameObj,
        educationLevel: values.educationLevel ?? '',
        workExperience: values.workExperience ?? '',
        details: values.additionalDetails ?? '',
        placementLocation: values.placementLocation ?? '',
        orgTreeId: values.orgTreeId.id ?? '',
        vacancyStatus: values.vacancyStaus ?? '',
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
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('create_position.position_name')}
                    </Typography>
                    <Field name="positionName">
                      {({ input }) => (
                        <Autocomplete
                          {...input}
                          freeSolo
                          options={positionNameOptions}
                          loading={positionNamesLoading}
                          getOptionLabel={(option) => option}
                          onInputChange={(_event, value) => {
                            input.onChange(value);
                          }}
                          onChange={(_event, value) => {
                            input.onChange(value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              margin="normal"
                              required
                              fullWidth
                              id="positionName"
                              label={t('create_position.position_name')}
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
                              }}
                            />
                          )}
                        />
                      )}
                    </Field>
                  </Grid2>
                  <Grid2 size={4}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('create_position.created_at')}
                    </Typography>
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
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('create_position.creation_decision_number')}
                    </Typography>
                    <Field name="creationDecisionNumber">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          id="creationDecisionNumber"
                          label={t('create_position.creation_decision_number')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('create_position.vacancy_size')}
                    </Typography>
                    <Field name="vacancySize">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          id="vacancySize"
                          label={t('create_position.vacancy_size')}
                          type="number"
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="start">%</InputAdornment>,
                              inputProps: { min: 0, max: 100 },
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('create_position.pricing_id')}
                    </Typography>
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
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('create_position.organization_tree')}
                    </Typography>
                    <Field name="orgTreeId">
                      {({ input }) => (
                        <Autocomplete
                          {...input}
                          options={filteredOrgTrees}
                          getOptionLabel={(option) => (option ? `${option.number} ${option.name}` : '')}
                          onChange={(_event, value) => {
                            input.onChange(value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              margin="normal"
                              required
                              fullWidth
                              id="orgTreeId"
                              label={t('create_position.organization_tree')}
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
                              }}
                            />
                          )}
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('create_position.placement_location')}
                    </Typography>
                    <Field name="placementLocation">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          id="placementLocation"
                          label={t('create_position.placement_location')}
                        />
                      )}
                    </Field>
                  </Grid2>

                  <Grid2 size={4}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('create_position.type')}
                    </Typography>
                    <Field name="type">
                      {({ input }) => (
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="type">{`${t('create_position.type')} *`}</InputLabel>
                          <Select
                            required
                            id="type"
                            value={input.value || ''}
                            onChange={(event) => input.onChange(event.target.value)}
                            label={t('create_position.type')}
                          >
                            <MenuItem value={1}>{t('create_position.type_position')}</MenuItem>
                            <MenuItem value={2}>{t('create_position.type_post')}</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                  </Grid2>
                </Grid2>

                <Accordion sx={{ mt: 2, mb: 2 }}>
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
                    <Typography>{t('eligibility')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      padding: '16px',
                      backgroundColor: alpha('#f5f5f5', 1),
                    }}
                  >
                    <Grid2 size={12}>
                      <Typography component={'div'} fontWeight={'fontWeightBold'}>
                        {t('create_position.education_level')}
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
                            label={t('create_position.education_level')}
                          />
                        )}
                      </Field>
                    </Grid2>
                    <Grid2 size={12}>
                      <Typography component={'div'} fontWeight={'fontWeightBold'}>
                        {t('create_position.work_experience')}
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
                            label={t('create_position.work_experience')}
                          />
                        )}
                      </Field>
                    </Grid2>
                  </AccordionDetails>
                </Accordion>
                <Accordion sx={{ mt: 2, mb: 4 }}>
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
                    <Typography>{t('additional_details')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      padding: '16px',
                      backgroundColor: alpha('#f5f5f5', 1),
                    }}
                  >
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
                            id="additionalDetails"
                            label={t('additional_details')}
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
