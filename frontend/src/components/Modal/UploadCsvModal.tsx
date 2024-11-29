import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Modal,
  Alert,
  List,
  ListItem,
  ListItemText,
  Grid2,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'redux/hooks';
import { uploadPositionsFromCsv, getPositions } from 'redux/slices/position-slice';

interface UploadCsvModalProps {
  open: boolean;
  handleClose: () => void;
}

const UploadCsvModal: React.FC<UploadCsvModalProps> = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const resetStates = () => {
    setSelectedFile(null);
    setUploading(false);
    setErrors([]);
    setSuccessCount(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setErrors([]);
    setSuccessCount(null);
  };

  const handleModalClose = () => {
    resetStates();
    handleClose();
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setErrors([]);
    setSuccessCount(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await dispatch(uploadPositionsFromCsv(formData));
      const payloadErrors = response.payload as { errors: string[] };
      const payloadSuccessCount = response.payload as { successCount: number };

      setErrors(payloadErrors.errors);
      setSuccessCount(payloadSuccessCount.successCount);

      if (!payloadErrors.errors.length) {
        setSelectedFile(null);
      }

      dispatch(getPositions());
    } catch (error) {
      console.error('File upload failed:', error);
      setErrors(['Unexpected error occurred during upload.']);
    } finally {
      setUploading(false);
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
          width: 600,
          bgcolor: 'background.paper',
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
            bgcolor: '#223B7C',
            color: 'white',
            borderTopLeftRadius: 1,
            borderTopRightRadius: 1,
          }}
        >
          <Typography variant="h6">{t('create_csv_position.title')}</Typography>
          <IconButton onClick={handleModalClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 4 }}>
          <Grid2 sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleFileUpload}
              disabled={uploading || !selectedFile}
              sx={{ backgroundColor: '#223B7C' }}
            >
              {uploading ? <CircularProgress size={24} /> : t('create_csv_position.upload')}
            </Button>
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </Grid2>
          {successCount !== null && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successCount + t('create_csv_position.success')}
            </Alert>
          )}
          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {`${t('create_csv_position.error1')}${errors.length}${t('create_csv_position.error2')}`}
            </Alert>
          )}
          <List>
            {errors.map((error, index) => (
              <ListItem key={index}>
                <ListItemText primary={error} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadCsvModal;
