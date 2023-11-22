'use client';

import { useClientCheck } from '@/hooks/useClientCheck';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout';
import { useCallback, useMemo } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useMutateTreasureBox } from '@/hooks/useMutateTreasureBox';
import { GAME_ID } from '@/constants/gameId';
import { useAccount } from 'wagmi';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useTreasureBox } from '@/hooks/useTreasureBox';
import { ProgressCard } from '@/components/assets/ProgressCard';
import { useScore } from '@/hooks/useScore';
import Footer from '@/components/navigation/footer';
import Image from 'next/image';

const imageUrl = '@/assets/images/map.png';

// hydration issue without dynamic import
const Navbar = dynamic(() => import('@/components/navigation/navbar'), {
  ssr: false,
});

export default function ArtReveal() {
  const isClient = useClientCheck();
  const { address } = useAccount();
  const { data: userPublicProfile } = useCBProfile({ address });
  const { data } = useScore({
    userAddress: address ?? '',
    gameId: GAME_ID,
  });

  const score = useMemo(() => {
    if (data && data.score?.currentScore) {
      return data.score.currentScore;
    }

    return 0;
  }, [data]);

  const { attackBox } = useMutateTreasureBox();

  const { data: treasureBox, isLoading } = useTreasureBox({ gameId: GAME_ID });

  const handleCTAPress = useCallback(() => {
    attackBox.mutate({
      gameId: GAME_ID,
      user: {
        address: address!,
        cbId: userPublicProfile?.subdomainProfile?.name,
        ensName: userPublicProfile?.ensDomainProfile?.name,
      },
    });
  }, [
    address,
    attackBox,
    userPublicProfile?.ensDomainProfile?.name,
    userPublicProfile?.subdomainProfile?.name,
  ]);

  const progress = useMemo(() => {
    if (!treasureBox?.totalHitpoints || !treasureBox?.currentHitpoints) {
      return 0;
    }

    return (
      Number(treasureBox.currentHitpoints / treasureBox.totalHitpoints) * 100
    );
  }, [treasureBox?.currentHitpoints, treasureBox?.totalHitpoints]);

  const content = useMemo(() => {
    return (
      <Stack
        direction="column"
        sx={{ width: '100%' }}
        alignItems="center"
        gap={2}
        paddingY={6}
      >
        <Typography variant="h5">Art Reveal</Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                width: '311px',
                height: '373px',
                border: '8px solid white',
                padding: '10px',
                position: 'relative',
              }}
            >
              <Image
                src={'/images/map.png' as string}
                alt="jumbotron"
                sizes="100vw"
                fill
                style={{
                  padding: '10px',
                  filter: 'blur(8px)',
                }}
              />
            </Box>
            <ProgressCard
              ctaText={`Tap to reveal (${score} pts)`}
              onPress={handleCTAPress}
              progress={progress}
              currentPoints={treasureBox?.currentHitpoints}
              totalPoints={treasureBox?.totalHitpoints}
            />
          </>
        )}
      </Stack>
    );
  }, [
    handleCTAPress,
    isLoading,
    progress,
    score,
    treasureBox?.currentHitpoints,
    treasureBox?.totalHitpoints,
  ]);

  if (!isClient || !treasureBox) return null;

  return (
    <Layout>
      <Navbar />
      {content}
      <Footer />
    </Layout>
  );
}
