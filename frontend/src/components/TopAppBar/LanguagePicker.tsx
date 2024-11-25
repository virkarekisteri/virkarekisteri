import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from 'react-i18n.config';

const LanguagePicker = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    handleMenuClose();
  };

  const currentLanguage = i18n.resolvedLanguage || 'fi';

  return (
    <div>
      <IconButton
        aria-label="select language"
        aria-controls="language-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        sx={{
          backgroundColor: '#FFFFFF',
          color: '#223B7C',
          fontSize: '1.2rem',
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: '#d3d8e5',
          },
        }}
      >
        {currentLanguage.toUpperCase()}
      </IconButton>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        keepMounted
      >
        {(Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[]).map((lng) => (
          <MenuItem key={lng} onClick={() => handleChangeLanguage(lng)} disabled={currentLanguage === lng}>
            {LANGUAGES[lng]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LanguagePicker;
