import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid2, Typography, alpha } from '@mui/material';
import EmployeeModal from 'components/Modal/EmployeeModal';
import type { Position } from 'models/Position';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import { formatDate } from 'utils/formatDate';
import { useGetPositionEmployeeQuery } from 'redux/api-slices/functions/position-employees-api';
import { skipToken } from '@reduxjs/toolkit/query';
import type { PositionEmployee } from 'models/PositionEmployee';
import { RequiresEditRole } from 'components/role-guards';

const EmployeeDetails: React.FC<{ position: Position }> = ({ position }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  const [currentPositionEmployee, setCurrentPositionEmployee] = useState<PositionEmployee | undefined>(undefined);
  const [currentReplacementEmployee, setCurrentReplacementEmployee] = useState<PositionEmployee | undefined>(undefined);
  const [isEmployeeSet, setIsEmployeeSet] = useState<boolean>(false);

  const { data: fetchedPositionEmployee } = useGetPositionEmployeeQuery(position.positionEmployeeId ?? skipToken);
  const { data: fetchedReplacementEmployee } = useGetPositionEmployeeQuery(position.replacementEmployeeId ?? skipToken);

  useEffect(() => {
    if (position.positionEmployeeId) {
      setCurrentPositionEmployee(fetchedPositionEmployee);
      setIsEmployeeSet(true);
    } else {
      setCurrentPositionEmployee(undefined);
      setIsEmployeeSet(false);
    }

    if (position.replacementEmployeeId) {
      setCurrentReplacementEmployee(fetchedReplacementEmployee);
    } else {
      setCurrentReplacementEmployee(undefined);
    }
  }, [
    position.positionEmployeeId,
    position.replacementEmployeeId,
    fetchedPositionEmployee,
    fetchedReplacementEmployee,
  ]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const [isReplacementActive, setIsReplacementActive] = useState(false);

  useEffect(() => {
    if (currentReplacementEmployee) {
      const today = new Date();
      const replacementStartDate = new Date(currentReplacementEmployee.startDate);
      const replacementEndDate = currentReplacementEmployee.endingDate
        ? new Date(currentReplacementEmployee.endingDate)
        : null;

      if (replacementStartDate <= today && (!replacementEndDate || replacementEndDate >= today)) {
        setIsReplacementActive(true);
      } else {
        setIsReplacementActive(false);
      }
    }
  }, [currentReplacementEmployee]);

  return (
    <Box>
      {position.vacancyStatus !== 0 && (
        <Grid2 size={12} display="flex" justifyContent="flex-end" alignItems={'flex-end'}>
          <Box sx={{ padding: 2, textAlign: 'right' }}>
            <RequiresEditRole>
              <Button
                variant="contained"
                onClick={handleOpenModal}
                sx={{
                  backgroundColor: '#223B7C',
                  color: 'white',
                  fontSize: '1rem',
                  padding: '10px 20px',
                  height: '36px',
                  display: 'inline-flex',
                  borderRadius: '25px 8px 8px 25px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
                startIcon={
                  <Box
                    component="span"
                    sx={{
                      marginRight: '8px',
                    }}
                  >
                    ✎
                  </Box>
                }
              >
                {isEmployeeSet ? t('edit_employee') : t('add_employee')}
              </Button>
            </RequiresEditRole>
          </Box>
        </Grid2>
      )}
      {currentPositionEmployee && (
        <Box>
          {isReplacementActive && (
            <Box sx={{ bgcolor: alpha('#223B7C', 1), color: 'white', p: 2, mb: 2 }}>
              <Typography variant="h6">{t('employee.replacement_active')}</Typography>
            </Box>
          )}
          <Accordion>
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
              <Typography>{t('employee.details')}</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                padding: '16px',
                backgroundColor: alpha('#f5f5f5', 1),
              }}
            >
              <Grid2 container spacing={2}>
                <Grid2 size={12} container spacing={2} alignItems="center">
                  <Grid2 size={4}>
                    <RenderReadonlyTextField
                      label={t('employee.employee_name')}
                      value={currentPositionEmployee.employeeName}
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <RenderReadonlyTextField
                      label={t('employee.start_date')}
                      value={formatDate(currentPositionEmployee.startDate.toString())}
                    />
                  </Grid2>
                  <Grid2 size={4}>
                    <RenderReadonlyTextField
                      label={t('employee.ending_date')}
                      value={
                        currentPositionEmployee.endingDate
                          ? formatDate(currentPositionEmployee.endingDate?.toString())
                          : t('employee.no_end_date')
                      }
                    />
                  </Grid2>
                </Grid2>
                {isReplacementActive && currentReplacementEmployee && (
                  <Grid2 size={12} container spacing={2} alignItems="center">
                    <Grid2 size={4}>
                      <RenderReadonlyTextField
                        label={t('employee.replacement_name')}
                        value={currentReplacementEmployee.employeeName}
                      />
                    </Grid2>
                    <Grid2 size={4}>
                      <RenderReadonlyTextField
                        label={t('employee.start_date')}
                        value={formatDate(currentReplacementEmployee.startDate.toString())}
                      />
                    </Grid2>
                    <Grid2 size={4}>
                      <RenderReadonlyTextField
                        label={t('employee.ending_date')}
                        value={
                          currentReplacementEmployee.endingDate
                            ? formatDate(currentReplacementEmployee.endingDate.toString())
                            : t('employee.no_end_date')
                        }
                      />
                    </Grid2>
                  </Grid2>
                )}
              </Grid2>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      <EmployeeModal
        open={modalOpen}
        onClose={handleCloseModal}
        position={position}
        isEmployeeSet={isEmployeeSet}
        employee={currentPositionEmployee}
        replacementEmployee={currentReplacementEmployee}
      />
    </Box>
  );
};

export default EmployeeDetails;
