import { memo } from 'react';

import { Box, Stack } from '@mui/material';

import HeroSVG from '@/components/assets/HeroSVG';
import Navbar from '@/components/navigation/navbar';

const Hero = () => {
  return (
    <Stack width="100%" flexDirection="column" mt="1rem" paddingTop={1}>
      <Navbar />
      <Box>
        <Stack
          flexDirection="column"
          alignItems="center"
          gap="1rem"
          justifyContent="center"
          width="100%"
          paddingY="1.5rem"
        >
          <HeroSVG />
        </Stack>
      </Box>
    </Stack>
  );
};

export default memo(Hero);
