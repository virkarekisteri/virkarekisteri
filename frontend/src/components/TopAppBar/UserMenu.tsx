import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';
import { AuthenticatedTemplate, useMsal } from '@azure/msal-react';
import { useAppSelector } from 'redux/hooks';
import { selectHighestRole, selectName } from 'redux/slices/auth-slice';

const UserMenu = () => {
  const { instance } = useMsal();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();

  const name = useAppSelector(selectName);
  const role = useAppSelector(selectHighestRole);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await instance.logoutRedirect({ account: instance.getActiveAccount() });
  };

  return (
    <div>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        sx={{
          width: 40,
          height: 40,
          '&:hover': {
            backgroundColor: '#d3d8e5',
          },
        }}
      >
        <AccountCircle sx={{ fontSize: 50 }} />
      </IconButton>

      <AuthenticatedTemplate>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem className={'pointer-events-none'}>{name}</MenuItem>
          <MenuItem className={'pointer-events-none'}>
            {t('user_menu.role')}: {role}
          </MenuItem>
          <MenuItem onClick={handleLogout}>{t('user_menu.logout')}</MenuItem>
        </Menu>
      </AuthenticatedTemplate>
    </div>
  );
};

export default UserMenu;
