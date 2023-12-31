'use client';

import BaseHuntAnimated from '@/components/Badges/AnimatedHero';
import { HomePageSVGRow } from '@/components/assets/icons/HomePageSVGRow';
import Text from '@/components/Text';
import { Stack, Button } from '@mui/material';

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
          <Text textAlign="center" fontSize="1rem">
            See Art. Mint Art. Reveal Art.
          </Text>
        </Stack>
      </Stack>
      <Text fontSize="1.2rem" textAlign="center">
        Collect onchain art, unlock exclusive Base merch.
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
            Thanks For Playing
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
