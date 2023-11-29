import { Box, Stack } from '@mui/material';
import { memo } from 'react';
import dynamic from 'next/dynamic';
import HeroSVG from '@/components/assets/HeroSVG';
import Text from '@/components/Text';

const Navbar = dynamic(() => import('@/components/navigation/navbar'), {
  ssr: false,
});

const Hero = () => {
  return (
    <Stack
      gap="12px"
      width="100%"
      flexDirection="column"
      mt="1rem"
      paddingTop={1}
    >
      <Navbar />
      <Box>
        <Stack
          flexDirection="column"
          alignItems="center"
          gap="1rem"
          justifyContent="center"
          width="100%"
          paddingY="48px"
        >
          <HeroSVG />
          <Text fontSize={20} fontWeight={400}>
            See art. Mint art. Reveal art.
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
};

export default memo(Hero);
