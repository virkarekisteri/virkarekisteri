import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PositionName } from 'models/PositionName';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Typography, alpha } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid2 from '@mui/material/Grid2';
import EditPositionNameModal from 'components/Modal/EditPositionNameModal';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import { RequiresEditRole } from 'components/role-guards';
import { useGetAdminChangelogsByObjectIdQuery } from 'redux/api-slices/functions/admin-changelog-api';
import type { AdminChangeLogEntry } from 'models/AdminChangeLogEntry';
import { format, parse, isValid } from 'date-fns';

interface PositionNameDetailsProps {
  positionName: PositionName;
  allPositionNames: PositionName[];
  doneEditingCallback: () => void;
}

const PositionNameDetails: React.FC<PositionNameDetailsProps> = ({
  positionName,
  allPositionNames,
  doneEditingCallback,
}) => {
  const { t } = useTranslation();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  // Callback for when the edit modal is submitted
  // Closes the modal and calls the doneEditingCallback function to close the detail view
  const handleSubmitEditModal = () => {
    setEditModalOpen(false);
    doneEditingCallback();
  };

  // Formats the changelog entries if needed
  const formatIfNeeded = (value: string, field: string) => {
    if (field === 'CreatedPositionName' && !value) {
      return '-';
    }
    if ((field === 'ValidFrom' || field === 'ValidUntil') && value) {
      const parsed = parse(value, 'dd/MM/yyyy H.mm.ss', new Date());
      if (!isValid(parsed)) {
        return value;
      }
      return format(parsed, 'd.M.yyyy');
    }
    return value;
  };

  // Returns the correct edited field label
  const getEditedFieldLabel = (field: string) => {
    switch (field) {
      case 'CreatedPositionName':
        return t('change_logs.fields.CreatedPositionName');
      case 'Name':
        return t('admin_panel.position_name.name');
      case 'ValidFrom':
        return t('admin_panel.position_name.valid_from');
      case 'ValidUntil':
        return t('admin_panel.position_name.valid_until');
      default:
        return field;
    }
  };

  const { data: positionNameChangelogs = [], isLoading: positionNameChangeLogsLoading } =
    useGetAdminChangelogsByObjectIdQuery(positionName.id);

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
              {t('admin_panel.position_name.edit')}
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
          {t('admin_panel.position_name.details')}
        </Typography>
      </Box>

      <Box padding={2}>
        <Grid2 container spacing={2} size={16}>
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('admin_panel.position_name.name')}
            </Typography>
            <RenderReadonlyTextField value={positionName.name} />
          </Grid2>

          {/* Position name timeframe */}
          <Grid2 size={4} px={2}>
            <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
              {t('admin_panel.position_name.time_frame')}
            </Typography>
            <RenderReadonlyTextField
              value={
                positionName.validFrom && positionName.validUntil
                  ? `${format(new Date(positionName.validFrom), 'd.M.yyyy')} - ${format(new Date(positionName.validUntil), 'd.M.yyyy')}`
                  : positionName.validFrom
                    ? `${format(new Date(positionName.validFrom), 'd.M.yyyy')} -`
                    : positionName.validUntil
                      ? `- ${format(new Date(positionName.validUntil), 'd.M.yyyy')}`
                      : ''
              }
            />
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
              {t('admin_panel.position_name.edit_history')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              padding: '16px',
              backgroundColor: alpha('#fffff', 1),
            }}
          >
            <Grid2 size={12}>
              {positionNameChangelogs.length > 0 ? (
                <Grid2 container spacing={0} sx={{ justifyContent: 'flex-start' }}>
                  {/* Edited field */}
                  <Grid2 size={2} sx={{ width: '20%' }}>
                    <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                      {t('change_logs.edited_field')}
                    </Typography>
                  </Grid2>

                  {/* Old value */}
                  <Grid2 size={3} sx={{ width: '20%' }}>
                    <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                      {t('change_logs.old_value')}
                    </Typography>
                  </Grid2>

                  {/* New value */}
                  <Grid2 size={3} sx={{ width: '20%' }}>
                    <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                      {t('change_logs.new_value')}
                    </Typography>
                  </Grid2>

                  {/* Editor */}
                  <Grid2 size={2} sx={{ width: '20%' }}>
                    <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                      {t('change_logs.editor')}
                    </Typography>
                  </Grid2>

                  {/* Timestamp */}
                  <Grid2 size={2} sx={{ width: '20%' }}>
                    <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                      {t('change_logs.timestamp')}
                    </Typography>
                  </Grid2>

                  {/* Changelog entries */}
                  {positionNameChangelogs.map((changelog: AdminChangeLogEntry) => (
                    <React.Fragment key={changelog.id}>
                      <Grid2 size={2} sx={{ width: '20%' }}>
                        <RenderReadonlyTextField value={getEditedFieldLabel(changelog.editedField)} />
                      </Grid2>
                      <Grid2 size={3} sx={{ width: '20%' }}>
                        <RenderReadonlyTextField value={formatIfNeeded(changelog.oldValue, changelog.editedField)} />
                      </Grid2>
                      <Grid2 size={3} sx={{ width: '20%' }}>
                        <RenderReadonlyTextField value={formatIfNeeded(changelog.newValue, changelog.editedField)} />
                      </Grid2>
                      <Grid2 size={2} sx={{ width: '20%' }}>
                        <RenderReadonlyTextField value={changelog.editor} />
                      </Grid2>
                      <Grid2 size={2} sx={{ width: '20%' }}>
                        <RenderReadonlyTextField value={format(new Date(changelog.timestamp), 'dd.MM.yyyy HH:mm:ss')} />
                      </Grid2>
                    </React.Fragment>
                  ))}
                </Grid2>
              ) : (
                <RenderReadonlyTextField value={t('change_logs.no_logs_found')} />
              )}
            </Grid2>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Edit Position Name Modal */}
      <EditPositionNameModal
        open={editModalOpen}
        handleClose={handleCloseEditModal}
        submitCallback={handleSubmitEditModal}
        positionName={positionName}
        allPositionNames={allPositionNames}
      />
    </Box>
  );
};
export default PositionNameDetails;
