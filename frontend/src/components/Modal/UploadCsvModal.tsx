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
import { useImportPositionsCsvMutation } from 'redux/api-slices/functions/positions-api';

interface UploadCsvModalProps {
  open: boolean;
  handleClose: () => void;
}

const UploadCsvModal: React.FC<UploadCsvModalProps> = ({ open, handleClose }) => {
  const { t } = useTranslation();

  const [importPositionsCsv, { isLoading }] = useImportPositionsCsvMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Ideally, the logic of having these states should be replaced with RTK query's built-in response data and error
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const resetStates = () => {
    setSelectedFile(null);
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

    setErrors([]);
    setSuccessCount(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await importPositionsCsv(formData).unwrap();

      setErrors(response.errors);
      setSuccessCount(response.successCount);

      if (!response.errors.length) {
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('File upload failed:', error);
      setErrors(['Unexpected error occurred during upload.']);
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
              disabled={isLoading || !selectedFile}
              sx={{ backgroundColor: '#223B7C' }}
            >
              {isLoading ? <CircularProgress size={24} /> : t('create_csv_position.upload')}
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
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            <List>
              {errors.map((error, index) => (
                <ListItem key={index}>
                  <ListItemText primary={error} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadCsvModal;
