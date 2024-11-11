import { Box, Button, Container, Typography } from '@mui/material';
import seinajokiLogo from '/seinajoki-logo.jpg';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="xs">
      <Box
        component="img"
        sx={{
          marginTop: 8,
          height: '145px',
        }}
        alt="Logo"
        src={seinajokiLogo}
      ></Box>
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: 2 }}>
        Joku teksti
      </Typography>
      <Box textAlign="center" sx={{ marginTop: 4 }}>
        <Button variant="contained" sx={{ backgroundColor: '#223B7C' }}>
          {t('landing_page.login')}
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
