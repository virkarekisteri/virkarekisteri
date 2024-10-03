// VirkarekisterContainer.tsx
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import seinajokiLogo from 'assets/seinajoki-logo.jpg'; 
import UserMenu from './UserMenu';

const VirkarekisterContainer = () => {
  return (
    <div>
      <AppBar position="static" sx={{ height: '114px', backgroundColor: '#223B7C' }}>
        <Toolbar className="flex justify-between">
          <img src={seinajokiLogo} alt="Logo" className="h-full" />
          <div className="flex items-center space-x-4">
            <Typography variant="h6" component="div" 
              sx={{ fontSize: '1.5rem', fontFamily: 'Trebuchet MS, sans-serif' }}>
              Virkarekisteri
            </Typography>
            <UserMenu />
          </div>
        </Toolbar>
      </AppBar>
      {/* Other components and content will go here */}
    </div>
  );
};

export default VirkarekisterContainer;
