import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography, alpha } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid2 from '@mui/material/Grid2';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import ModifyVirkaModal from 'components/Modal/ModifyVirkaModal';
import { useTranslation } from 'react-i18next';
import type { Position } from 'models/Position';
import { useGetOrganizationTreesQuery } from 'redux/api-slices/functions/organization-trees-api';
import { RequiresEditRole } from 'components/role-guards';
import EndPositionModal from 'components/Modal/EndPositionModal';
import { useGetSubjectsQuery } from 'redux/api-slices/functions/subjects';

interface BasicDetailsProps {
  position: Position;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({ position }) => {
  const { t } = useTranslation();

  const { data: orgTrees = [] } = useGetOrganizationTreesQuery();

  const { data: subjects = [] } = useGetSubjectsQuery();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const [openEndModal, setOpenEndModal] = useState(false);

  const handleOpenEndModal = () => setOpenEndModal(true);
  const handleCloseEndModal = () => setOpenEndModal(false);

  const positionOrganization = orgTrees.find((x) => x.id === position.orgTreeId);

  const getTeacherSubjects = () => {
    if (position.isTeacher && position.subjectIds && subjects.length > 0) {
      return position.subjectIds
        .map(subjectId => {
          const subject = subjects.find(s => s.id === subjectId);
          return subject ? subject.subjectName : null;
        })
        .filter((subjectName): subjectName is string => subjectName !== null);
    }
    return [];
  };

  const teacherSubjects = getTeacherSubjects();

  const statusTextMap: Record<number, string> = {
    2: t('vacancy_statuses.active'),
    1: t('vacancy_statuses.established'),
    0: t('vacancy_statuses.abolished'),
  };

  const positionTypeTextMap: Record<number, string> = {
    2: t('position_type.post'),
    1: t('position_type.position'),
  };

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        borderRadius: '0px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      {position.vacancyStatus !== 0 && (
        <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between' }}>
          <RequiresEditRole>
            <Button
              variant="contained"
              onClick={handleOpenEndModal}
              sx={{
                backgroundColor: '#223B7C',
                color: 'white',
                fontSize: '1rem',
                padding: '10px 20px',
                height: '36px',
                display: 'inline-flex',
                borderRadius: '8px 25px 25px 8px',
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
                  ✖
                </Box>
              }
            >
              {t('end_position.title')}
            </Button>
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
              {t('edit_position.title')}
            </Button>
          </RequiresEditRole>
        </Box>
      )}
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
          {t('position.details')}
        </Typography>
      </Box>
      <Box padding={2}>
        <Grid2 container spacing={2} size={12}>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('table.vacancy_number')}
            </Typography>
            <RenderReadonlyTextField value={position.vacancyNumber} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('create_position.position_name')}
            </Typography>
            <RenderReadonlyTextField value={position.positionName.name} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('table.type')}
            </Typography>
            <RenderReadonlyTextField value={positionTypeTextMap[position.type]} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('table.vacancy_status')}
            </Typography>
            <RenderReadonlyTextField value={statusTextMap[position.vacancyStatus]} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('create_position.vacancy_size')}
            </Typography>
            <RenderReadonlyTextField value={(position.vacancySize ? position.vacancySize * 100 : 0).toFixed()} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('basic_details.vacancy_fill')}
            </Typography>
            <RenderReadonlyTextField value={(position.vacancyFill ? position.vacancyFill * 100 : 0).toFixed()} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('table.placement_location')}
            </Typography>
            <RenderReadonlyTextField value={position.placementLocation} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('create_position.organization_tree')}
            </Typography>
            <RenderReadonlyTextField value={`${positionOrganization?.number} ${positionOrganization?.name}`} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('create_position.pricing_id')}
            </Typography>
            <RenderReadonlyTextField value={position.pricingId?.toString()} />
          </Grid2>
          {position.isTeacher && (
            <Grid2 size={12} px={2}>
              <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                {t('create_position.subjects')}
              </Typography>
              <RenderReadonlyTextField
                value={teacherSubjects.join(', ')}
              />
            </Grid2>
          )}

        </Grid2>

        <Accordion sx={{ mt: 2, mb: 4 }}>
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
              {t('eligibility')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: '16px',
              backgroundColor: alpha('#fffff', 1),
            }}
          >
            <Grid2 size={12}>
              <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                {t('create_position.education_level')}
              </Typography>
              <RenderReadonlyTextField value={position.educationLevel} />
            </Grid2>
            <Grid2 size={12}>
              <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                {t('create_position.work_experience')}
              </Typography>
              <RenderReadonlyTextField value={position.workExperience} />
            </Grid2>
          </AccordionDetails>
        </Accordion>

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
              <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                {t('additional_details')}
              </Typography>
              <RenderReadonlyTextField value={position.details} />
            </Grid2>
          </AccordionDetails>
        </Accordion>
      </Box>
      <EndPositionModal open={openEndModal} onClose={handleCloseEndModal} position={position} />
      <ModifyVirkaModal open={editModalOpen} handleClose={handleCloseEditModal} position={position} />
    </Box>
  );
};

export default BasicDetails;
