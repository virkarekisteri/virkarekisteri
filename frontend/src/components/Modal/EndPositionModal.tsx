import React from 'react';
import { Box, Button, Modal, Typography, TextField, Grid2, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Form, Field } from 'react-final-form';
import RenderReadonlyTextField from 'components/Details/RenderReadonlyTextField';
import { useEndPositionMutation } from 'redux/api-slices/functions/positions-api';
import type { Position } from 'models/Position';

interface EndPositionModalProps {
  open: boolean;
  onClose: () => void;
  position: Position;
}

const EndPositionModal: React.FC<EndPositionModalProps> = ({ open, onClose, position }) => {
  const { t } = useTranslation();
  const [endPosition] = useEndPositionMutation();

  const handleSubmit = async (values: Position) => {
    if (!position.id) return undefined;

    if (values.endedAt && values.endingDecisionNumber)
      endPosition({
        id: position.id,
        endDto: { endAt: values.endedAt, endingDecisionNumber: values.endingDecisionNumber },
      });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
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
            bgcolor: '#223B7C',
            color: 'white',
            borderTopLeftRadius: 1,
            borderTopRightRadius: 1,
          }}
        >
          <Typography variant="h6">{t('end_position.title')}</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 4, pt: 0 }}>
          <Form
            onSubmit={handleSubmit}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <Grid2 container spacing={2}>
                  <Grid2 size={6}>
                    <Typography sx={{ mt: 2 }} fontWeight={'fontWeightBold'}>
                      {t('end_position.vacancy_number')}
                    </Typography>
                    <RenderReadonlyTextField value={position.vacancyNumber} />
                  </Grid2>
                  <Grid2 size={6}>
                    <Typography sx={{ mt: 2 }} fontWeight={'fontWeightBold'}>
                      {t('end_position.position_name')}
                    </Typography>
                    <RenderReadonlyTextField value={position.positionName.name} />
                  </Grid2>
                  <Grid2 size={6}>
                    <Field name="endedAt">
                      {({ input }) => (
                        <TextField
                          {...input}
                          label={t('end_position.end_date')}
                          type="date"
                          fullWidth
                          required
                          sx={{ mt: 2 }}
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      )}
                    </Field>
                  </Grid2>
                  <Box
                    sx={{
                      height: '2px',
                      backgroundColor: '#223b7c',
                      width: '100%',
                      my: 0,
                    }}
                  />
                  <Grid2 size={12}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('end_position.decision_number')}
                    </Typography>
                    <Field name="endingDecisionNumber">
                      {({ input }) => (
                        <TextField
                          {...input}
                          label={t('end_position.decision_number')}
                          fullWidth
                          required
                          rows={4}
                          sx={{ mt: 2 }}
                        />
                      )}
                    </Field>
                  </Grid2>
                </Grid2>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button onClick={onClose} sx={{ mr: 2 }}>
                    {t('end_position.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: '#D32F2F', color: 'white' }}
                    disabled={submitting || pristine}
                  >
                    {t('end_position.confirm')}
                  </Button>
                </Box>
              </form>
            )}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default EndPositionModal;
