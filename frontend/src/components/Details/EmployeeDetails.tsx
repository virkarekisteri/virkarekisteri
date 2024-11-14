import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import EmployeeModal from 'components/Modal/EmployeeModal';
import type { Position } from 'models/Position';

const EmployeeDetails: React.FC<{ position: Position }> = ({ position }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box>
      {/* Existing EmployeeDetails content */}
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        Add Employee
      </Button>
      <EmployeeModal open={modalOpen} onClose={handleCloseModal} />
    </Box>
  );
};

export default EmployeeDetails;
