/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, IconButton, Typography, Modal, Grid2 } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'redux/hooks';
import { addPositionEmployee, fetchPositionEmployee } from 'redux/slices/position-employee-slice';
import type { Position } from 'models/Position';
import type { PositionEmployee } from 'models/PositionEmployee';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  isEmployeeSet?: boolean;
  position: Position;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose, isEmployeeSet, position }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [fetchedEmployee, setFetchedEmployee] = useState<PositionEmployee | undefined>();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (position.positionEmployeeId) {
        const result = await dispatch(fetchPositionEmployee(position.positionEmployeeId));
        if (result.payload) {
          setFetchedEmployee(result.payload as PositionEmployee);
        }
      }
    };

    fetchEmployee();
  }, [dispatch, position.positionEmployeeId]);

  const handleSubmit = async (values: any) => {
    try {
      const data = { ...values, positionId: position.id };
      if (isEmployeeSet) {
        // For the future
        // dispatch(updatePositionEmployee({ ...fetchedEmployee, ...values }));
        console.log('Update employee');
      } else {
        dispatch(addPositionEmployee(data));
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
          <Typography variant="h6">{isEmployeeSet ? t('edit_employee') : t('add_employee')}</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 4 }}>
          <Form
            onSubmit={handleSubmit}
            initialValues={{
              ...fetchedEmployee,
              startDate: fetchedEmployee?.startDate
                ? new Date(fetchedEmployee.startDate).toISOString().split('T')[0]
                : '',
              endingDate: fetchedEmployee?.endingDate,
            }}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2} size={12}>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('employee.employee_name')}
                    </Typography>
                    <Field name="employeeName">
                      {({ input }) => <TextField {...input} margin="normal" required fullWidth />}
                    </Field>
                  </Grid2>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('employee.start_date')}
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
                      {t('employee.ending_date')}
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
                    {t('employee.save')}
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
