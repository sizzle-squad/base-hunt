import { Box, LinearProgress, Stack } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { NavbarClient } from '@/components/navigation/navbar/NavbarClient';
import { useProgress } from '@/context/NavigationContext';
import { NavigationProgressBar } from './NavigationProgress';

const Navbar = () => {
  const { isProgressing } = useProgress();
  const [progress, setProgress] = useState(0);

  return (
    <Stack gap={1}>
      <Stack direction="row" spacing={2} alignItems={'center'} width="100%">
        <NavbarClient />
      </Stack>
    </Stack>
  );
};

export default memo(Navbar);
