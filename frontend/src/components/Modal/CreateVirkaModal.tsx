// CreateVirkaModal.tsx
import { Box, TextField, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import React from 'react';
import axios from 'axios';
import { Form, Field } from 'react-final-form';

interface CreateVirkaModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateVirkaModal: React.FC<CreateVirkaModalProps> = ({ open, handleClose }) => {
  const onSubmit = async (values: any) => {
    try {
      await axios.post('https://your-api-url/posts', values);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, pristine }) => (
            <form onSubmit={handleSubmit}>
              <Field name="title">
                {({ input }) => <TextField {...input} margin="normal" required fullWidth id="title" label="Title" />}
              </Field>
              <Field name="content">
                {({ input }) => (
                  <TextField
                    {...input}
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    rows={4}
                    id="content"
                    label="Content"
                  />
                )}
              </Field>
              <Button type="submit" variant="contained" disabled={submitting || pristine}>
                Save
              </Button>
            </form>
          )}
        />
      </Box>
    </Modal>
  );
};

export default CreateVirkaModal;
