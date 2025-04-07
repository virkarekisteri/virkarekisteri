import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Costcentre } from 'models/Costcentre';
import { RequiresEditRole } from 'components/role-guards';
import { 
    Box, 
    Grid2, 
    Button, 
    Typography 
} from '@mui/material';
import { format } from 'date-fns';
import RenderReadonlyTextField from './RenderReadonlyTextField';
import ModifyCostcentreModal from 'components/Modal/ModifyCostcentreModal';

interface CostcentreDetailsProps {
  costcentre: Costcentre;
}

const CostcentreDetails: React.FC<CostcentreDetailsProps> = ({ costcentre }) => {   
    const { t } = useTranslation();

    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleOpenEditModal = () => {
        setEditModalOpen(true);
    }

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    }


    return(
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
                <Grid2 container spacing={2} size={10}>
                    <Grid2 size={4} px={2}>
                        <Typography component={'div'} sx={{ color: '#7f7f7f' }}>
                            {t('admin_panel.costcentre.number')}
                        </Typography>
                        <RenderReadonlyTextField value={costcentre.number.toString()} />
                    </Grid2>

                    <Grid2 size={4} px={2}>
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
            </Box>

            <ModifyCostcentreModal 
                open={editModalOpen}
                onClose={handleCloseEditModal}
                costcentre={costcentre}
            />
        </Box>
    );

};

export default CostcentreDetails;
