import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Costcentre } from 'models/Costcentre';
import { RequiresEditRole } from 'components/role-guards';
import {
    Box,
    Grid2,
    Button,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    alpha
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format, parse } from 'date-fns';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import ModifyCostcentreModal from 'components/Modal/ModifyCostcentreModal';
import { useGetAdminChangelogsByObjectIdQuery } from 'redux/api-slices/functions/admin-changelog-api';
import type { AdminChangeLogEntry } from 'models/AdminChangeLogEntry';

interface CostcentreDetailsProps {
    costcentre: Costcentre;
    onEditSubmit?: () => void;
}

const CostcentreDetails: React.FC<CostcentreDetailsProps> = ({ costcentre, onEditSubmit }) => {
    const { t } = useTranslation();

    const [editModalOpen, setEditModalOpen] = useState(false);

    const { data: costcentreChangelogs = [] } = useGetAdminChangelogsByObjectIdQuery(costcentre.id);
    
    const handleOpenEditModal = () => {
        setEditModalOpen(true);
    }

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    }

    const formatIfNeeded = (value: string, field: string) => {
        if (field === 'CreatedCostcentre' && !value) {
            return '-';
        }
        if ((field === 'ValidFrom' || field === 'ValidUntil') && value) {
            const parsed = parse(value, 'dd/MM/yyyy H.mm.ss', new Date());
            return format(parsed, 'd.M.yyyy');
        }
        return value;
    };

    const getFieldLabel = (field: string) => {
        switch (field) {
            case 'CreatedCostcentre':
                return t('change_logs.fields.CreatedCostcentre');
            case 'Number':
                return t('admin_panel.costcentre.number');
            case 'Name':
                return t('admin_panel.costcentre.name');
            case 'ValidFrom':
                return t('admin_panel.costcentre.valid_from');
            case 'ValidUntil':
                return t('admin_panel.costcentre.valid_until');
            default:
                return field;
        }
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
                            {t('admin_panel.costcentre.edit')}
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
                    {t('admin_panel.costcentre.details')}
                </Typography>
            </Box>

            <Box padding={2}>
                <Grid2 container spacing={2} size={12}>
                    <Grid2 size={3} px={2}>
                        <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                            {t('admin_panel.costcentre.number')}
                        </Typography>
                        <RenderReadonlyTextField value={costcentre.number.toString()} />
                    </Grid2>

                    <Grid2 size={5} px={2}>
                        <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                            {t('admin_panel.costcentre.name')}
                        </Typography>
                        <RenderReadonlyTextField value={costcentre.name} />
                    </Grid2>

                    <Grid2 size={4} px={2}>
                        <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                            {t('admin_panel.costcentre.time_frame')}
                        </Typography>
                        <RenderReadonlyTextField
                            value={
                                costcentre.validFrom && costcentre.validUntil
                                    ? `${format(new Date(costcentre.validFrom), 'd.M.yyyy')} - ${format(new Date(costcentre.validUntil), 'd.M.yyyy')}`
                                    : costcentre.validFrom
                                        ? `${format(new Date(costcentre.validFrom), 'd.M.yyyy')} -`
                                        : costcentre.validUntil
                                            ? `- ${format(new Date(costcentre.validUntil), 'd.M.yyyy')}`
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
                            {t('admin_panel.costcentre.edit_history')}
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails
                        sx={{
                            padding: '16px',
                            backgroundColor: alpha('#ffffff', 1),
                        }}
                    >

                        <Grid2 size={12}>
                            {costcentreChangelogs.length > 0 ? (
                                <Grid2 container spacing={0} sx={{ justifyContent: 'flex-start' }}>
                                    <Grid2 size={2} sx={{ width: '20%' }}>
                                        <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                                            {t('change_logs.edited_field')}
                                        </Typography>
                                    </Grid2>
                                    <Grid2 size={3} sx={{ width: '20%' }}>
                                        <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                                            {t('change_logs.old_value')}
                                        </Typography>
                                    </Grid2>
                                    <Grid2 size={3} sx={{ width: '20%' }}>
                                        <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                                            {t('change_logs.new_value')}
                                        </Typography>
                                    </Grid2>
                                    <Grid2 size={2} sx={{ width: '20%' }}>
                                        <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                                            {t('change_logs.editor')}
                                        </Typography>
                                    </Grid2>
                                    <Grid2 size={2} sx={{ width: '20%' }}>
                                        <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                                            {t('change_logs.timestamp')}
                                        </Typography>
                                    </Grid2>

                                    {costcentreChangelogs.map((changelog: AdminChangeLogEntry) => (
                                        <React.Fragment key={changelog.id}>
                                            <Grid2 size={2} sx={{ width: '20%' }}>
                                                <RenderReadonlyTextField
                                                    value={getFieldLabel(changelog.editedField)}
                                                />
                                            </Grid2>
                                            <Grid2 size={3} sx={{ width: '20%' }}>
                                                <RenderReadonlyTextField
                                                    value={formatIfNeeded(changelog.oldValue, changelog.editedField)}
                                                />
                                            </Grid2>
                                            <Grid2 size={3} sx={{ width: '20%' }}>
                                                <RenderReadonlyTextField
                                                    value={formatIfNeeded(changelog.newValue, changelog.editedField)}
                                                />
                                            </Grid2>
                                            <Grid2 size={2} sx={{ width: '20%' }}>
                                                <RenderReadonlyTextField value={changelog.editor} />
                                            </Grid2>
                                            <Grid2 size={2} sx={{ width: '20%' }}>
                                                <RenderReadonlyTextField
                                                    value={format(new Date(changelog.timestamp), 'dd.MM.yyyy HH:mm:ss')}
                                                />
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

            <ModifyCostcentreModal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                costcentre={costcentre}
                onSubmitSuccess={onEditSubmit}
            />
        </Box>
    );

};

export default CostcentreDetails;
