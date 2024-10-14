import { Box, TextField, Button, Grid2, IconButton, Typography, InputAdornment } from '@mui/material';
import Modal from '@mui/material/Modal';
import React from 'react';
import { Form, Field } from 'react-final-form';
import CloseIcon from '@mui/icons-material/Close';
import { createPosition } from 'services/functions/positions-service';
import type { Position } from 'types/Position';
interface CreateVirkaModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateVirkaModal: React.FC<CreateVirkaModalProps> = ({ open, handleClose }) => {
  const onSubmit = async (values: Partial<Position>) => {
    try {
      const positionData: Position = {
        createdAt: new Date(values.createdAt || ''),
        endedAt: values.endedAt ? new Date(values.endedAt) : undefined,
        vacancySize: values.vacancySize,
        vacancyFill: values.vacancyFill,
        creationDecisionNumber: values.creationDecisionNumber || '',
        endingDecisionNumber: values.endingDecisionNumber,
        type: values.type || 0, // Assuming a default type value
      };

      await createPosition(positionData);
      handleClose();
    } catch (error) {
      console.error(error);
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
          <Typography variant="h6">Lisää uusi virka</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 4 }}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2} size={12}>
                  <Grid2 size={4}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      Perustamisajankohta
                    </Typography>
                    <Field name="createdAt">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          id="createdAt"
                          label="Perustamisajankohta"
                          type="date"
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    </Field>
                  </Grid2>
                  <Grid2 size={4}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      Päätösnumero
                    </Typography>
                    <Field name="creationDecisionNumber">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          id="creationDecisionNumber"
                          label="Päätösnumero"
                        />
                      )}
                    </Field>
                  </Grid2>
                  <Grid2 size={4}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      Koko-%
                    </Typography>
                    <Field name="vacancySize">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          fullWidth
                          id="vacancySize"
                          label="Koko-%"
                          type="number"
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="start">%</InputAdornment>,
                              inputProps: { min: 0, max: 100 },
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Grid2>
                  <Grid2 sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, width: '100%' }}>
                    <Button type="submit" variant="contained" disabled={submitting || pristine}>
                      Save
                    </Button>
                  </Grid2>
                </Grid2>
              </form>
            )}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateVirkaModal;
