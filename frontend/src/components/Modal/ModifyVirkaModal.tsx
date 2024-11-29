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

interface ModifyVirkaModalProps {
  open: boolean;
  handleClose: () => void;
}

const ModifyVirkaModal: React.FC<ModifyVirkaModalProps> = ({ open, handleClose }) => {
  const { t } = useTranslation();

  const placeholderData = {
    vacancyNumber: '12301230',
    type: 2,
    vacancySize: 45,
    positionName: 'Teppo Tappi',
    orgTree: '1230 KOULUKOULU',
    placementLocation: 'Seinäjoki',
    vacancyFill: 30,
    pricingId: '1230',
    educationLevel: 'Lukio',
    workExperience: 'Ei ole',
    additionalDetails: 'Ei ole',
  };

  const onSubmit = (values: any) => {
    console.log('Modified values:', values);
    handleClose();
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
            initialValues={placeholderData}
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
                    <Typography sx={{ mt: 1 }}>{placeholderData.vacancyNumber}</Typography>
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
                            {...input}
                            options={['Placeholder Name 1', 'Placeholder Name 2']}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                margin="normal"
                                required
                                label={t('edit_position.position_name')}
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
                          {...input}
                          options={['Placeholder Cost Center 1', 'Placeholder Cost Center 2']}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              margin="normal"
                              required
                              label={t('edit_position.organization_tree')}
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
                      {({ input }) => <TextField {...input} fullWidth margin="normal" />}
                    </Field>
                  </Grid2>

                  {/* Type */}
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('edit_position.type')}
                    </Typography>
                    <Field name="type" initialValue={placeholderData.type}>
                      {({ input }) => (
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="type-select-label">{`${t('edit_position.type')} *`}</InputLabel>
                          <Select
                            required
                            labelId="type-select-label"
                            id="type-select"
                            value={input.value} // Bind directly to input.value
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
                    <Field name="pricingId">{({ input }) => <TextField {...input} fullWidth margin="normal" />}</Field>
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
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
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
                          InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
                        />
                      )}
                    </Field>
                  </Grid2>

                  {/* Additional Details */}
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
                <Grid2 sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
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
                </Grid2>
              </form>
            )}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default ModifyVirkaModal;
