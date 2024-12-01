/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, IconButton, Typography, Modal, Grid2, FormControlLabel, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'redux/hooks';
import { addPositionEmployee, updatePositionEmployee } from 'redux/slices/position-employee-slice';
import type { Position } from 'models/Position';
import type { PositionEmployee } from 'models/PositionEmployee';
import ReplacementAccordion from './ReplacementAccordion';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  isEmployeeSet?: boolean;
  position: Position;
  employee?: PositionEmployee;
  replacementEmployee?: PositionEmployee;
}

const EmployeeModal: React.FC<AddEmployeeModalProps> = ({
  open,
  onClose,
  isEmployeeSet,
  position,
  employee,
  replacementEmployee,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isReplacementToggle, setIsReplacementToggle] = useState(false);

  useEffect(() => {
    setIsReplacementToggle(replacementEmployee?.replacement ?? false);
  }, [replacementEmployee]);

  const handleSubmit = async (values: any) => {
    try {
      const data = { ...values, positionId: position.id };

      if (values.isReplacement) {
        const replacementData = {
          employeeName: values.replacementEmployeeName,
          startDate: values.replacementStartDate,
          endingDate: values.replacementEndingDate,
          positionId: position.id ?? '',
          replacement: true,
        };

        dispatch(addPositionEmployee(replacementData as any));

        if (employee?.id) {
          dispatch(updatePositionEmployee({ ...employee, inLeave: true }));
        }
        return;
      }

      delete data.replacementEmployeeName;
      delete data.replacementStartDate;
      delete data.replacementEndingDate;
      delete data.isReplacement;

      if (isEmployeeSet) {
        dispatch(updatePositionEmployee({ ...employee, ...data, inLeave: false }));
      } else {
        dispatch(addPositionEmployee(data));
      }

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    return utcDate.toISOString().split('T')[0];
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
              employeeName: employee?.employeeName,
              startDate: employee?.startDate ? formatDateForInput(employee.startDate.toString()) : 'No start date',
              endingDate: employee?.endingDate ? formatDateForInput(employee.endingDate.toString()) : null,
              replacementEmployeeName: replacementEmployee?.employeeName,
              replacementStartDate: replacementEmployee?.startDate
                ? formatDateForInput(replacementEmployee.startDate.toString())
                : 'No start date',
              replacementEndingDate: replacementEmployee?.endingDate
                ? formatDateForInput(replacementEmployee.endingDate.toString())
                : null,
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
                {isEmployeeSet && (
                  <Field name="isReplacement" type="checkbox">
                    {({ input }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            {...input}
                            checked={isReplacementToggle}
                            onChange={(event) => {
                              input.onChange(event);
                              setIsReplacementToggle(event.target.checked);
                            }}
                            name="isReplacement"
                            color="primary"
                          />
                        }
                        label={t('employee.replacement')}
                      />
                    )}
                  </Field>
                )}

                {isReplacementToggle && <ReplacementAccordion />}
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

export default EmployeeModal;
