import { Box, Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from 'auth/auth-config';

const LandingPage = () => {
  const { t } = useTranslation();
  const { instance } = useMsal();

  const handleLogin = async () => {
    await instance.loginRedirect(loginRequest);
  };

  return (
    <Container maxWidth="xs">
      <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginTop: 5 }}>
        {t('landing_page.welcome')}
      </Typography>
      <Box textAlign="center" sx={{ marginTop: 4 }}>
        <Button variant="contained" sx={{ backgroundColor: '#223B7C' }} onClick={handleLogin}>
          {t('landing_page.login')}
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
