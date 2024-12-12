import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import seinajokiLogo from '/seinajoki-logo.jpg';
import LanguagePicker from './LanguagePicker';
import UserMenu from './UserMenu';
import { useTranslation } from 'react-i18next';

const TopAppBar = () => {
  const { t } = useTranslation();

  return (
    <AppBar position="static" sx={{ height: '80px', backgroundColor: '#223B7C' }}>
      <Toolbar>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', paddingX: 10 }}>
          <img src={seinajokiLogo} alt="Logo" style={{ height: '80px' }} />
        </Box>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: '1.6rem',
            fontFamily: 'Trebuchet MS, sans-serif',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
          }}
        >
          {t('app_name')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, paddingX: 5 }}>
          <LanguagePicker />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
