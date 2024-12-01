import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Grid2,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import React, { useEffect } from 'react';
import { Field, Form } from 'react-final-form';
import { useAppSelector } from 'redux/hooks';
import { fetchPositionNames, selectPositionNames, selectPositionNamesLoading } from 'redux/slices/position-name-slice';
import { getOrganizationTrees, selectOrganizationTreeData } from 'redux/slices/organization-tree-slice';
import { useAppDispatch } from 'redux/hooks';

interface MassChangesModalProps {
  open: boolean;
  handleClose: () => void;
}

const MassChangesModal: React.FC<MassChangesModalProps> = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const options = [
    t('create_position.organization_tree'),
    t('create_position.position_name'),
    t('create_position.pricing_id'),
    t('create_position.education_level'),
    t('create_position.work_experience'),
  ];

  const positionNames = useAppSelector(selectPositionNames);
  const positionNamesLoading = useAppSelector(selectPositionNamesLoading);
  const positionNameOptions = positionNames.map((option) => option.name);

  const organizationTrees = useAppSelector(selectOrganizationTreeData);
  const filteredOrgTrees = organizationTrees
    .filter((tree) => tree.alue === 'KUSTANNUSPAIKKA')
    .sort((a, b) => a.number.localeCompare(b.number));

  useEffect(() => {
    if (open) {
      dispatch(fetchPositionNames());
      dispatch(getOrganizationTrees());
    }
  }, [dispatch, open]);

  const [selectedOption, setSelectedOption] = useState<string | null>('');
  const [isFieldEnabled, setIsFieldEnabled] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const onSubmit = async () => {
    try {
      //jotain
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
          <Typography variant="h6">{t('mass_changes.make_changes')}</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 4 }}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit}>
                <Grid2>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('mass_changes.edit_field')}
                    </Typography>
                    <Autocomplete
                      options={options}
                      id="auto-complete"
                      autoComplete
                      includeInputInList
                      onChange={(_event, newValue) => {
                        setSelectedOption(newValue);
                        setIsFieldEnabled(Boolean(newValue));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          margin="normal"
                          required
                          fullWidth
                          id="positionName"
                          label={t('mass_changes.field_type')}
                          sx={{
                            '& input[type="search"]::-webkit-search-cancel-button': {
                              WebkitAppearance: 'none',
                            },
                          }}
                          slotProps={{
                            input: {
                              ...params.InputProps,
                              type: 'search',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid2>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('mass_changes.new_value')}
                    </Typography>
                    {selectedOption !== 'Kustannuspaikka' &&
                      selectedOption !== 'Organization tree' &&
                      selectedOption !== 'Virkanimike' &&
                      selectedOption !== 'Position name' && (
                        <TextField margin="normal" required fullWidth id="emptyField" label={''} />
                      )}
                    {(selectedOption === 'Virkanimike' || selectedOption === 'Position name') && (
                      <Field name="positionName">
                        {({ input }) => (
                          <Autocomplete
                            {...input}
                            freeSolo
                            options={positionNameOptions}
                            loading={positionNamesLoading}
                            getOptionLabel={(option) => option}
                            onInputChange={(_event, value) => {
                              input.onChange(value);
                            }}
                            onChange={(_event, value) => {
                              input.onChange(value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                margin="normal"
                                required
                                fullWidth
                                id="positionName"
                                label={t('create_position.position_name')}
                                sx={{}}
                              />
                            )}
                          />
                        )}
                      </Field>
                    )}
                    {(selectedOption === 'Kustannuspaikka' || selectedOption === 'Organization tree') && (
                      <Field name="orgTreeId">
                        {({ input }) => (
                          <Autocomplete
                            {...input}
                            options={filteredOrgTrees}
                            getOptionLabel={(option) => (option ? `${option.number} ${option.name}` : '')}
                            onChange={(_event, value) => {
                              input.onChange(value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                margin="normal"
                                required
                                fullWidth
                                id="orgTreeId"
                                label={t('create_position.organization_tree')}
                                sx={{
                                  '& input[type="search"]::-webkit-search-cancel-button': {
                                    WebkitAppearance: 'none',
                                  },
                                }}
                                slotProps={{
                                  input: {
                                    ...params.InputProps,
                                    type: 'search',
                                  },
                                }}
                              />
                            )}
                          />
                        )}
                      </Field>
                    )}
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2} size={12} justifyContent="left" marginTop={1}>
                  <Grid2 size={6}>
                    <Typography component={'div'} fontWeight={'fontWeightBold'}>
                      {t('edit_position.creation_decision_number')}
                    </Typography>
                    <Field name="creationDecisionNumber">
                      {({ input }) => (
                        <TextField
                          {...input}
                          margin="normal"
                          required
                          fullWidth
                          id="creationDecisionNumber"
                          label={t('edit_position.creation_decision_number')}
                        />
                      )}
                    </Field>
                  </Grid2>
                </Grid2>
                <Grid2 size={12}>
                  <Typography component={'div'} fontWeight={'fontWeightBold'}>
                    {t('edit_position.creation_description')}
                  </Typography>
                  <Field name="creation_description">
                    {({ input }) => (
                      <TextField
                        {...input}
                        margin="normal"
                        fullWidth
                        multiline
                        maxRows={4}
                        id="creation_description"
                        label={t('edit_position.creation_description')}
                      />
                    )}
                  </Field>
                </Grid2>
                <Grid2 size={6} mt={2} sx={{ display: 'flex', alignItems: 'right', justifyContent: 'right' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleClickOpenDialog}
                    sx={{ backgroundColor: '#223B7C' }}
                    disabled={submitting || pristine}
                  >
                    {t('mass_changes.make_change')}
                  </Button>
                  <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogContent>
                      <DialogContentText id="success">{t('mass_changes.changes_executed')}</DialogContentText>
                    </DialogContent>
                  </Dialog>
                </Grid2>
              </form>
            )}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default MassChangesModal;
