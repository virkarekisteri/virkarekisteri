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
} from '@mui/material';
import Modal from '@mui/material/Modal';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { Form, Field } from 'react-final-form';
import CloseIcon from '@mui/icons-material/Close';
import { addPosition } from 'redux/slices/position-slice';
import type { Position } from 'models/Position';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'redux/hooks';
interface CreateVirkaModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateVirkaModal: React.FC<CreateVirkaModalProps> = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onSubmit = async (values: Partial<Position>) => {
    try {
      const positionData: Position = {
        createdAt: new Date(values.createdAt || ''),
        endedAt: values.endedAt ? new Date(values.endedAt) : undefined,
        vacancySize: Number(values.vacancySize) / 100,
        vacancyFill: values.vacancyFill,
        creationDecisionNumber: values.creationDecisionNumber ?? '',
        endingDecisionNumber: values.endingDecisionNumber,
        type: values.type ?? 0,
        educationLevel: values.educationLevel ?? '',
        workExperience: values.workExperience ?? '',
        details: values.details ?? '',
        placementLocation: values.placementLocation ?? '',
      };

      await dispatch(addPosition(positionData));
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
          width: 1000,
          bgcolor: 'background.paper',
          border: '2px solid #000',
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
            borderBottom: '1px solid #ccc',
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
                </Grid2>

                <Accordion sx={{ mt: 2, mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ backgroundColor: alpha('#223B7C', 1), color: 'white' }}
                  >
                    <Typography>{t('eligibility')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      backgroundColor: alpha('#223B7C', 1),
                      color: 'white',
                    }}
                  >
                    <Typography>{t('additional_details')}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid2 size={12}>
                      <Typography component={'div'} fontWeight={'fontWeightBold'}>
                        {t('additional_details')}
                      </Typography>
                      <Field name="additionalDetails">
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
                <Grid2 sx={{ display: 'flex', justifyContent: 'flex-end'}}>
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
