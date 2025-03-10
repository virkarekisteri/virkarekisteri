import React from 'react';
import {
  Box,
  Checkbox,
  FormGroup,
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
} from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

import type { TeacherSubject } from 'models/TeacherSubject'
import { useUpdateTeacherSubjectMutation } from 'redux/api-slices/functions/teachersubject-api';

//import type { Position } from 'models/Position';
import { useGetPositionNamesQuery } from 'redux/api-slices/functions/position-names-api';
//import { useUpdatePositionMutation } from 'redux/api-slices/functions/positions-api';
import { useGetOrganizationTreesQuery } from 'redux/api-slices/functions/organization-trees-api';
import { idID } from '@mui/material/locale';

interface EditSubjectModalProps {
  open: boolean;
  handleClose: () => void;
  position: TeacherSubject;
}

interface FormValues {
  subjectName: string;
  active: boolean;
  /*   endedAt?: Date;
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
  decisionNumber?: string; */
}

const EditSubjectModal: React.FC<EditSubjectModalProps> = ({ open, handleClose, position }) => {

  const { t } = useTranslation();

  const { data: positionNames = [] } = useGetPositionNamesQuery();
  const { data: organizationTrees = [] } = useGetOrganizationTreesQuery();

  const [updateSubject] = useUpdateTeacherSubjectMutation();

  const filteredOrgTrees = organizationTrees
    .filter((tree) => tree.alue === 'KUSTANNUSPAIKKA')
    .sort((a, b) => a.number.localeCompare(b.number));

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
        subjectName: values.subjectName,
        active: values.active
/*         endedAt: values.endedAt,
        endingDecisionNumber: values.endingDecisionNumber,
        placementLocation: values.placementLocation,
        vacancyFill: values.vacancyFill ? values.vacancyFill / 100 : undefined, // Convert percentage to decimal
        positionName: values.positionName ? { name: values.positionName.name } : undefined,
        orgTreeId: values.orgTree,
        pricingId: values.pricingId,
        vacancySize: values.vacancySize ? values.vacancySize / 100 : undefined, // Convert percentage to decimal
        educationLevel: values.educationLevel,
        workExperience: values.workExperience,
        details: values.details,
        type: values.type,
        decisionNumber: values.decisionNumber,
       */
      };
      console.log(updateData)
      //updateSubject({ id: position.id, subject: updateData });
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
              subjectName: position.subjectName,
              active: false


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


                  {/* Name */}
                  <Grid2 size={12}>
                    <Field name="subjectName">
                      {({ input }) => (
                          <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          placeholder={position.subjectName}
                          label={t('edit_position.placement_location')}
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          />
                        )
                      }
                    </Field>
                  {/* //</Grid2> */}

                  {/* Active checkbox */}
                  {/* <Grid2 size={12}> */}
                    <Field name="active" type="checkbox">
                    {({input}) => (
                        <FormControlLabel control={
                          <Checkbox {...input} /* checked={Boolean(input.value)} */ />
                        } label="aktiivinen" />
                      )
                    }
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

export default EditSubjectModal;
