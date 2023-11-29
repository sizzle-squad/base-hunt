import { Stack } from '@mui/material';
import { memo } from 'react';
import { NavbarClient } from '@/components/navigation/navbar/NavbarClient';

const Navbar = () => {
  return (
    <Stack direction="row" spacing={2} alignItems={'center'} width="100%">
      <NavbarClient />
    </Stack>
  );
};

export default memo(Navbar);
