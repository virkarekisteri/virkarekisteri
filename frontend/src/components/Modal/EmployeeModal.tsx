import React, { useEffect } from 'react';
import { Box, TextField, Button, IconButton, Typography, Modal, Grid2 } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import type { PositionEmployee } from 'models/PositionEmployee';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee?: PositionEmployee;
  isEdit?: boolean;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose, employee, isEdit }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (open && employee) {
      // Fetch any necessary data if needed
    }
  }, [open, employee]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEdit) {
        await axios.put(`/api/positionemployees/${employee?.id}`, values);
      } else {
        await axios.post('/api/positionemployees', values);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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
          <Typography variant="h6">{isEdit ? t('edit_employee') : t('add_employee')}</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 4 }}>
          <Form
            onSubmit={handleSubmit}
            initialValues={employee}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2} size={12}>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('employee_name')}
                    </Typography>
                    <Field name="employeeName">
                      {({ input }) => <TextField {...input} margin="normal" required fullWidth />}
                    </Field>
                  </Grid2>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('start_date')}
                    </Typography>
                    <Field name="startDate">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          type="date"
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    </Field>
                  </Grid2>
                  <Grid2 size={6}></Grid2>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('ending_date')}
                    </Typography>
                    <Field name="endingDate">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          type="date"
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    </Field>
                  </Grid2>
                </Grid2>
                <Grid2 sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" disabled={submitting || pristine}>
                    {t('save')}
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

export default AddEmployeeModal;
