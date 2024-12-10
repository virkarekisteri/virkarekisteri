/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, IconButton, Typography, Modal, Grid2, FormControlLabel, Switch } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import type { Position } from 'models/Position';
import type { PositionEmployee } from 'models/PositionEmployee';
import ReplacementAccordion from './ReplacementAccordion';
import {
  useCreatePositionEmployeeMutation,
  useUpdatePositionEmployeeMutation,
} from 'redux/api-slices/functions/position-employees-api';

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
  const [isReplacementToggle, setIsReplacementToggle] = useState(false);

  const [createPositionEmployee] = useCreatePositionEmployeeMutation();
  const [updatePositionEmployee] = useUpdatePositionEmployeeMutation();

  useEffect(() => {
    setIsReplacementToggle(replacementEmployee?.replacement ?? false);
  }, [replacementEmployee]);

  const handleSubmit = async (values: any) => {
    try {
      const data = { ...values, positionId: position.id };

      if (isReplacementToggle) {
        const replacementData = {
          positionEmployee: {
            employeeName: values.replacementEmployeeName,
            startDate: values.replacementStartDate,
            endingDate: values.replacementEndingDate,
            positionId: position.id ?? '',
            replacement: true,
          },
          decisionNumber: values.decisionNumber,
        };

        createPositionEmployee(replacementData as any);

        if (employee?.id) {
          updatePositionEmployee({ ...employee, inLeave: true });
        }
        return;
      }

      delete data.replacementEmployeeName;
      delete data.replacementStartDate;
      delete data.replacementEndingDate;
      delete data.isReplacement;

      if (isEmployeeSet) {
        updatePositionEmployee({ ...employee, ...data, inLeave: false });
      } else {
        delete data.decisionNumber;
        createPositionEmployee({ positionEmployee: data, decisionNumber: '' });
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
          maxHeight: '90vh',
          overflow: 'auto',
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
                : null,
              replacementEndingDate: replacementEmployee?.endingDate
                ? formatDateForInput(replacementEmployee.endingDate.toString())
                : null,
              decisionNumber: '',
              isReplacement: replacementEmployee?.replacement ?? false,
            }}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2} size={12}>
                  <Grid2 size={6}>
                    <Field name="employeeName">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          label={t('employee.employee_name')}
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    </Field>
                  </Grid2>
                  <Grid2 size={6}>
                    <Field name="startDate">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          type="date"
                          label={t('employee.start_date')}
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    </Field>
                  </Grid2>
                  <Grid2 size={6}></Grid2>
                  <Grid2 size={6}>
                    <Field name="endingDate">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          type="date"
                          label={t('employee.ending_date')}
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
                <Box
                  sx={{
                    height: '2px',
                    backgroundColor: '#223b7c',
                    width: '100%',
                    my: 0,
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                />
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
