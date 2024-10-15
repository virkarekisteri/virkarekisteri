import Toolbar from '@mui/material/Toolbar';
import seinajokiLogo from '/seinajoki-logo.jpg';
import Typography from '@mui/material/Typography';
import UserMenu from './UserMenu';
import AppBar from '@mui/material/AppBar';
import { useTranslation } from 'react-i18next';
import LanguagePicker from './LanguagePicker';

const TopAppBar = () => {
  const { t } = useTranslation();

  return (
    <AppBar position="static" sx={{ height: '114px', backgroundColor: '#223B7C' }}>
      <Toolbar className="flex justify-between">
        <img src={seinajokiLogo} alt="Logo" className="h-full" />
        <div className="flex items-center space-x-4">
          <LanguagePicker />
          <Typography variant="h6" component="div" sx={{ fontSize: '1.5rem', fontFamily: 'Trebuchet MS, sans-serif' }}>
            {t('app_name')}
          </Typography>
          <UserMenu />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;
