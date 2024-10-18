import { TextField } from '@mui/material';
import React from 'react';

export interface OwnProps {
  label?: string;
  value?: string;
}
const RenderReadonlyTextField = ({ label, value }: OwnProps) => {
  return (
    <TextField
      label={label}
      value={value}
      fullWidth
      variant="standard"
      slotProps={{
        input: { disableUnderline: true },
      }}
    />
  );
};

export default React.memo(RenderReadonlyTextField);
