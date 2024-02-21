'use client';

import { Button, Stack } from '@mui/material';

import { HomePageSVGRow } from '@/components/assets/icons/HomePageSVGRow';
import BaseHuntAnimated from '@/components/Badges/AnimatedHero';
import Text from '@/components/Text';

export default function Thanks() {
  return (
    <Stack
      direction="column"
      justifyContent={['space-between', 'unset']}
      sx={{
        position: 'absolute',
        px: '20px',
        pt: '35px',
        width: '100%',
        height: '100%',
        backgroundImage: `url('/images/landing-bg.svg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
      gap="4rem"
    >
      <Stack width="100%" justifyContent="center" alignItems="center">
        <BaseHuntAnimated width="100%" />
        <Stack
          width="100%"
          justifyContent="center"
          alignItems="center"
          gap=".6rem"
        >
          <HomePageSVGRow />
        </Stack>
      </Stack>
      <Text fontSize="1.2rem" textAlign="center">
        Play onchain and unlock prizes.
      </Text>
      <Stack width="100%" alignItems="center">
        <Stack
          paddingTop={5}
          alignItems="center"
          width={['100%', '60%', '40%']}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              py: '20px',
              px: 3,
              fontSize: '16px',
              backgroundColor: '#000000',
              width: '100%',
              borderRadius: '12px',
              fontFamily: 'CoinbaseMono',
              fontWeight: 400,
            }}
          >
            Basehunt is coming...
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
