import React, { useState } from 'react';
import { Box, Button, Grid2 } from '@mui/material';
import EmployeeModal from 'components/Modal/EmployeeModal';
import type { Position } from 'models/Position';
import { useTranslation } from 'react-i18next';

const EmployeeDetails: React.FC<{ position: Position }> = ({ position }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const isEmployeeSet = position.positionEmployeeId !== null;

  return (
    <Box>
      <Grid2 size={12} display="flex" justifyContent="flex-end" alignItems={'flex-end'}>
        <Button variant="contained" sx={{ backgroundColor: '#223B7C' }} onClick={handleOpenModal}>
          {isEmployeeSet ? t('edit_employee') : t('add_employee')}
        </Button>
      </Grid2>

      <EmployeeModal open={modalOpen} onClose={handleCloseModal} position={position} isEmployeeSet={isEmployeeSet} />
    </Box>
  );
};

export default EmployeeDetails;
