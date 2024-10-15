import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import React from 'react';
import { LANGUAGES } from 'react-i18n.config';

const LanguagePicker = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuOpen}
      >
        <p className="text-white">{i18n.resolvedLanguage}</p>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        keepMounted={true}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {(Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[]).map((lng) => (
          <MenuItem key={lng} onClick={() => handleChangeLanguage(lng)} disabled={i18n.resolvedLanguage === lng}>
            {LANGUAGES[lng]}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguagePicker;
