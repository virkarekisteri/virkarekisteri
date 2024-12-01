import { Autocomplete, Box, Grid2, IconButton, Modal, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";
import { useState } from "react";
// import { useAppSelector } from "redux/hooks";
// import { selectPositionNames, selectPositionNamesLoading } from "redux/slices/position-name-slice";
// import { Field } from "react-final-form";
// import { useAppDispatch } from "redux/hooks";

interface MassChangesModalProps {
    open: boolean;
    handleClose: () => void;
  }

  const options = ['Kustannuspaikka', 'Virkanimike', 'Hinnoittelutunnus', 'Koulutustaso', 'Työkokemus'];

  const MassChangesModal: React.FC<MassChangesModalProps> = ({ open, handleClose }) => {
    const { t } = useTranslation();
    // const dispatch = useAppDispatch();

    // const positionNames = useAppSelector(selectPositionNames);
    // const positionNamesLoading = useAppSelector(selectPositionNamesLoading);
    // const positionNameOptions = positionNames.map((option) => option.name);

    const [selectedOption, setSelectedOption] = useState<string | null>(''); 
    const [isFieldEnabled, setIsFieldEnabled] = useState(false);

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
                <Grid2 size={12}>
                    <Grid2 size={6}>
                    <Autocomplete
                        options={options}
                        id="auto-complete"
                        autoComplete
                        includeInputInList
                        onChange={(event, newValue) => {
                            setSelectedOption(newValue); // Update the selected option
                            setIsFieldEnabled(Boolean(newValue)); // Enable the secondary field if something is selected
                          }}
                        renderInput={(params) => (
                        <TextField
                              {...params}
                              margin="normal"
                              required
                              fullWidth
                              id="positionName"
                              label={"Kentän tyyppi"}
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
                        {selectedOption === 'Kustannuspaikka' || selectedOption === 'Virkanimike' ? (
                            <Autocomplete
                            options={selectedOption === 'Kustannuspaikka' ? ['Option 1', 'Option 2'] : ['Option A', 'Option B']}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={`Autocomplete for ${selectedOption}`}
                                disabled={!isFieldEnabled}
                              />
                            )}
                          />
                    ) : (
                        <TextField
                              required
                              fullWidth
                              disabled={!isFieldEnabled}
                              label={""}
                            />
                      )}
                    </Grid2>
                </Grid2>
            </Box>
            </Box>
        </Modal>
    );
    };

    export default MassChangesModal;