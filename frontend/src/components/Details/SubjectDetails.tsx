import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TeacherSubject } from 'models/TeacherSubject';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography, alpha } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid2 from '@mui/material/Grid2';
import EditSubjectModal from '../Modal/EditSubjectModal'
import RenderReadonlyTextField from './RenderReadonlyTextField';
import { RequiresEditRole } from 'components/role-guards';

interface SubjectDetailsProps {
  position: TeacherSubject;
}

const SubjectDetails: React.FC<SubjectDetailsProps> = ({ position }) => {
  const { t } = useTranslation();


  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '0px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
      >
  
      {
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'right' }}>
          <RequiresEditRole>

            <Button
              variant="contained"
              onClick={handleOpenEditModal}
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
              {t('admin_panel.teacher_subjects.edit_subject')}
            </Button>
          </RequiresEditRole>
        </Box>
      }
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          height: 40,
          borderBottom: '1px solid #ccc',
          bgcolor: '#223B7C',
          color: 'white',
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
          }}
          >
        <Typography
          sx={{
            color: 'white',
            fontSize: '1.2rem',
            textTransform: 'none',
          }}
        >
          {t('admin_panel.teacher_subjects.details')}
        </Typography>
      </Box>

      <Box padding={2}>
        <Grid2 container spacing={2} size={16}>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('admin_panel.teacher_subjects.name')}
            </Typography>
            <RenderReadonlyTextField value={position.subjectName} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('admin_panel.teacher_subjects.status')}
            </Typography>
            <RenderReadonlyTextField value={position.active ? t('admin_panel.teacher_subjects.active') : t('admin_panel.teacher_subjects.inactive')} />
          </Grid2>
        </Grid2>


        <Accordion sx={{ mt: 2, mb: 0 }}>
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
            <Typography sx={{ color: 'white', fontSize: '1.0rem', fontWeight: 'bold', textTransform: 'none' }}>
              {t('additional_details')}
            </Typography>

          </AccordionSummary>
          <AccordionDetails
          sx={{
            padding: '16px',
            backgroundColor: alpha('#fffff', 1),
            }}
            >
            <Grid2 size={12}>
              {/* 
              <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('additional_details')}
              </Typography>
                */}
              <RenderReadonlyTextField value={"HELLOW ORLD!"} />
              </Grid2>
              </AccordionDetails>

              </Accordion>
              </Box>

              
      <EditSubjectModal open={editModalOpen} handleClose={handleCloseEditModal} position={position} />
    </Box>
  );
};
export default SubjectDetails;
