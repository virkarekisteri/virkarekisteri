import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, alpha, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid2 from '@mui/material/Grid2';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import type { Position } from 'models/Position';
import { useTranslation } from 'react-i18next';
import { fetchOrganization } from 'redux/slices/organization-tree-slice';
import { useAppDispatch } from 'redux/hooks';
import type { OrganizationTree } from 'models/OrganizationTree';

interface BasicDetailsProps {
  position: Position;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({ position }) => {
  const { t } = useTranslation();

  const [positionOrganization, setPositionOrganization] = useState<OrganizationTree | undefined>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchOrganizationById = async () => {
      if (position.orgTreeId) {
        const result = await dispatch(fetchOrganization(position.orgTreeId));
        if (result.payload) {
          setPositionOrganization(result.payload as OrganizationTree);
        }
      }
    };

    fetchOrganizationById();
  }, [dispatch, position.orgTreeId]);

  const statusTextMap: Record<number, string> = {
    2: t('vacancy_statuses.active'),
    1: t('vacancy_statuses.established'),
    0: t('vacancy_statuses.abolished'),
  };

  const positionTypeTextMap: Record<number, string> = {
    2: t('position_type.type_post'),
    1: t('position_type.type_position'),
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          height: 30,
          borderBottom: '1px solid #ccc',
          bgcolor: '#223B7C',
          color: 'white',
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
        }}
      >
        <Typography>{t('position.details')}</Typography>
      </Box>
      <Box padding={3}>
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
            <RenderReadonlyTextField value={(position.vacancySize ? position.vacancySize * 100 : 0).toString()} />
          </Grid2>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('basic_details.vacancy_fill')}
            </Typography>
            <RenderReadonlyTextField value={(position.vacancyFill ? position.vacancyFill * 100 : 0).toString()} />
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
        </Grid2>

        <Accordion sx={{ mt: 2, mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              backgroundColor: alpha('#223B7C', 1),
              color: 'white',
            }}
          >
            <Typography>{t('eligibility')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
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

        <Accordion sx={{ mt: 2, mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{
              backgroundColor: alpha('#223B7C', 1),
              color: 'white',
            }}
          >
            <Typography>{t('additional_details')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RenderReadonlyTextField value={position.details} />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default BasicDetails;
