'use client';

import BadgeContainer from '@/components/assets/BadgeContainer';
import { useBadges } from '@/hooks/useBadges';
import { useClientCheck } from '@/hooks/useClientCheck';
import { Box, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export default function Badges() {
  const isClient = useClientCheck();
  const { address, isConnected } = useAccount();
  const { useGetBadges } = useBadges({ address, isConnected });

  // hydration issue without dynamic import
  const Hero = dynamic(() => import('@/components/Badges/Hero'), {
    ssr: false,
  });

  const { data: badges, isLoading, error } = useGetBadges();

  const BadgesWrapper = useMemo(() => {
    if (isClient) {
      return (
        <>
          {isLoading && <div>Loading...</div>}
          {error && <div>Error...</div>}
          {badges && (
            <>
              <Stack
                sx={{
                  paddingTop: '30px',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
                gap={2}
              >
                <Typography
                  variant="h5"
                  textAlign="left"
                  fontWeight="fontWeightBold"
                  sx={{ fontSize: '22px' }}
                >
                  Art Basel (Miami)
                </Typography>
                {badges && badges.data && (
                  <BadgeContainer badges={badges.data.irlBadges} />
                )}
              </Stack>
              <Stack
                sx={{
                  paddingTop: '30px',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
                gap={2}
              >
                <Typography
                  variant="h5"
                  textAlign="left"
                  fontWeight="fontWeightBold"
                  sx={{ fontSize: '22px' }}
                >
                  Virtual
                </Typography>
                {badges && badges.data && (
                  <BadgeContainer badges={badges.data.onlineBadges} />
                )}
              </Stack>
            </>
          )}
        </>
      );
    }
  }, [isClient, badges, isLoading, error]);

  return (
    <Box>
      <Hero />
      <Box>{BadgesWrapper}</Box>
    </Box>
  );
}
