import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid2 from '@mui/material/Grid2';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import { useAppSelector } from 'redux/hooks';
import { selectPositionLoading } from 'redux/slices/position-slice';
import type { Position } from 'models/Position';
import { useTranslation } from 'react-i18next';

interface BasicDetailsProps {
  position: Position;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({ position }) => {
  const loading = useAppSelector(selectPositionLoading);
  const { t } = useTranslation();

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{t('position.details')}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid2 container spacing={2} sx={{ padding: 2, border: '1px solid #ccc', background: '#F5F5F5' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Grid2 size={{ xs: 12 }} container spacing={2} alignItems="center">
                <Grid2 size={{ xs: 4 }}>
                  <RenderReadonlyTextField label={t('table.type')} value={position.type.toString()} />
                </Grid2>
                <Grid2 size={{ xs: 8 }}>
                  <RenderReadonlyTextField
                    label={t('table.creation_decision_number')}
                    value={position.creationDecisionNumber}
                  />
                </Grid2>
              </Grid2>
            </>
          )}
        </Grid2>
      </AccordionDetails>
    </Accordion>
  );
};

export default BasicDetails;
