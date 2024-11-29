import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid2, Typography } from '@mui/material';
import EmployeeModal from 'components/Modal/EmployeeModal';
import type { Position } from 'models/Position';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import type { PositionEmployee } from 'models/PositionEmployee';
import { fetchPositionEmployee } from 'redux/slices/position-employee-slice';
import { useAppDispatch } from 'redux/hooks';
import { formatDate } from 'utils/formatDate';

const EmployeeDetails: React.FC<{ position: Position }> = ({ position }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const [positionEmployee, setPositionEmployee] = useState<PositionEmployee | undefined>();
  const [replacementEmployee, setReplacementEmployee] = useState<PositionEmployee | undefined>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (position.positionEmployeeId) {
        const originalEmployeeResult = await dispatch(fetchPositionEmployee(position.positionEmployeeId));
        const originalEmployee = originalEmployeeResult.payload as PositionEmployee;

        if (position.replacementEmployeeId) {
          const replacementEmployeeResult = await dispatch(fetchPositionEmployee(position.replacementEmployeeId));
          const replacementEmployee = replacementEmployeeResult.payload as PositionEmployee;
          setReplacementEmployee(replacementEmployee);
        }
        setPositionEmployee(originalEmployee);
      }
    };

    fetchEmployee();
  }, [dispatch, position.positionEmployeeId, position.replacementEmployeeId]);
  const isEmployeeSet = position.positionEmployeeId !== null;

  const [isReplacementActive, setIsReplacementActive] = useState(false);

  useEffect(() => {
    if (replacementEmployee) {
      const today = new Date();
      const replacementStartDate = new Date(replacementEmployee.startDate);
      const replacementEndDate = replacementEmployee.endingDate ? new Date(replacementEmployee.endingDate) : null;

      if (replacementStartDate <= today && (!replacementEndDate || replacementEndDate >= today)) {
        setIsReplacementActive(true);
      } else {
        setIsReplacementActive(false);
      }
    }
  }, [replacementEmployee]);

  return (
    <Box>
      <Grid2 size={12} display="flex" justifyContent="flex-end" alignItems={'flex-end'}>
        <Box sx={{ padding: 2, textAlign: 'right' }}>
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
        </Box>
      </Grid2>
      {positionEmployee && (
        <Box>
          {isReplacementActive && (
            <Box sx={{ bgcolor: 'info.main', color: 'white', p: 2, mb: 2 }}>
              <Typography variant="h6">{t('employee.replacement_active')}</Typography>
            </Box>
          )}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{t('employee.details')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid2 container spacing={2} sx={{ padding: 2, border: '1px solid #ccc', background: '#F5F5F5' }}>
                <>
                  <Grid2 size={12} container spacing={2} alignItems="center">
                    <Grid2 size={4}>
                      <RenderReadonlyTextField
                        label={t('employee.employee_name')}
                        value={positionEmployee.employeeName}
                      />
                    </Grid2>
                    <Grid2 size={4}>
                      <RenderReadonlyTextField
                        label={t('employee.start_date')}
                        value={formatDate(positionEmployee.startDate.toString())}
                      />
                    </Grid2>
                    <Grid2 size={4}>
                      <RenderReadonlyTextField
                        label={t('employee.ending_date')}
                        value={
                          positionEmployee.endingDate
                            ? formatDate(positionEmployee.endingDate?.toString())
                            : t('employee.no_end_date')
                        }
                      />
                    </Grid2>
                  </Grid2>
                </>
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
        employee={positionEmployee}
        replacementEmployee={replacementEmployee}
      />
    </Box>
  );
};

export default EmployeeDetails;
