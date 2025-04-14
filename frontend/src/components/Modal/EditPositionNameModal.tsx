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

import RenderReadonlyTextField from '../Details/RenderReadonlyTextField';

import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';

import type { PositionName } from 'models/PositionName'
import { useUpdatePositionNameMutation } from 'redux/api-slices/functions/position-names-api';
import { useCreatePositionNameMutation } from 'redux/api-slices/functions/position-names-api';

interface EditPositionNameModalProps {
  open: boolean;
  handleClose: () => void;
  positionName: PositionName | undefined;
  allPositionNames: PositionName[];
}

interface FormValues {
  subjectName: string;
  active: boolean;
}



const EditPositionNameModal: React.FC<EditPositionNameModalProps> = ({ open, handleClose, positionName, allPositionNames }) => {

  const isCreateDialog: boolean = positionName === undefined ? true : false;

  const { t } = useTranslation();

  
  const [ updateSubject ] = useUpdatePositionNameMutation();
  const [ createSubject ] = useCreatePositionNameMutation();




  const initialValues: Partial<PositionName> = positionName !== undefined ? 
  {
    name: positionName.name,
    validFrom: positionName.validFrom,
    validUntil: positionName.validUntil
  } 
  :
  {
    name: "", 
    validFrom: "",
    validUntil: ""
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateSubjectName = (value: string, allValues: Record<string, any>) => {
    if (value && allPositionNames.some(
        (posName) => {return (posName.name === value.toLowerCase() && (isCreateDialog || (positionName && value != positionName.name)))}
      ))
      return t('admin_panel.error.subject_name_exists_error');

    return undefined;
  };

  const onSubmit = async (values: FormValues) => {
    if (!positionName || !positionName.id) {
      try {

        const subjectData: Partial<PositionName> = {
          name: values.subjectName.toLowerCase(),
          validFrom: new Date(),
          validUntil: new Date()
        };
        console.log("Creating new subject!")
        createSubject(subjectData)
        handleClose();
        return;
      } catch (error) {
        console.error('Failed to create subject:', error);
    }
  }
  else {

    try {
      const updateData = {
        name: values.subjectName.toLowerCase(),
        validFrom: new Date(),
        validTo: new Date()
      };
      console.log(updateData)
      updateSubject({ id: positionName.id, data: updateData });
      handleClose();
    } catch (error) {
      console.error('Failed to update subject:', error);
    }
  };
}



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
          <Typography variant="h6">{isCreateDialog ? t('admin_panel.teacher_subjects.create_subject') : t('admin_panel.teacher_subjects.edit_subject')}</Typography>
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
                      {t('admin_panel.teacher_subjects.details')}
                    </Typography>
                  </Box>
                  <RenderReadonlyTextField value={isCreateDialog ? '' : t('admin_panel.teacher_subjects.editwarning')} />
                  {/* Name */}
                  <Grid2 size={12}>
                    <Field name="subjectName" validate={validateSubjectName}>
                      {({ input, meta }) => {
                        
                        //console.log(input)
                        return (
                          <TextField
                          {...input}
                          fullWidth
                          margin="normal"
                          placeholder={initialValues.name}
                          label={t('admin_panel.teacher_subjects.name')}
                          error={meta.error && meta.touched}
                          helperText={meta.touched && meta.error}
                          
                          slotProps={{
                            inputLabel: {
                              shrink: true,
                            },
                          }}
                          />
                        )}
                      }
                    </Field>
                  {/* //</Grid2> */}

                  {/* Active checkbox */}
                  {/* <Grid2 size={12}> */}
                    <Field name="active" type="checkbox">
                    {({input}) => (
                        <FormControlLabel control={
                          <Checkbox {...input} /* checked={Boolean(input.value)} */ />
                        } label={t('admin_panel.teacher_subjects.active')} />
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
