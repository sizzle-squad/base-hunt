'use client';

import { useClientCheck } from '@/hooks/useClientCheck';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout';
import { useCallback, useMemo } from 'react';
import { Box, CircularProgress, Stack } from '@mui/material';
import { useMutateTreasureBox } from '@/hooks/useMutateTreasureBox';
import { GAME_ID } from '@/constants/gameId';
import { useAccount } from 'wagmi';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useTreasureBox } from '@/hooks/useTreasureBox';
import { ProgressCard } from '@/components/assets/ProgressCard';
import { useScore } from '@/hooks/useScore';
import Footer from '@/components/navigation/footer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ArtRevealClient from './ArtRevealClient';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';

const imageUrl = '@/assets/images/map.png';

// hydration issue without dynamic import
const Navbar = dynamic(() => import('@/components/navigation/navbar'), {
  ssr: false,
});

export default function ArtReveal() {
  const isClient = useClientCheck();
  const router = useRouter();
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

  const handleLearnMorePress = useCallback(() => {
    // TODO: link to NFT or artist
    router.push('/art-reveal');
  }, [router]);

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
                border: '8px solid var(--White, #FFF)',
                padding: '20px',
                position: 'relative',
                boxShadow:
                  '0px 0.5px 0.5px 0px rgba(0, 0, 0, 0.04), 0px 1px 1px 0px rgba(0, 0, 0, 0.05), 0px 2px 2px 0px rgba(0, 0, 0, 0.06), 0px 4px 4px 0px rgba(0, 0, 0, 0.07), 0px 8px 8px 0px rgba(0, 0, 0, 0.08), 0px 16px 16px 0px rgba(0, 0, 0, 0.10)',
                marginBottom: '20px',
                marginTop: '25px',
              }}
            >
              <Image
                src={'/images/map.png' as string}
                alt="jumbotron"
                sizes="100vw"
                fill
                style={{
                  padding: '10px',
                  filter: !treasureBox?.isOpen ? 'blur(8px)' : 'none',
                }}
              />
            </Box>
            {treasureBox?.isOpen ? (
              <ArtRevealClient />
            ) : (
              <ProgressCard
                ctaText={`Tap to reveal (${score} pts)`}
                onPress={handleCTAPress}
                progress={progress}
                currentPoints={treasureBox?.currentHitpoints}
                totalPoints={treasureBox?.totalHitpoints}
              />
            )}
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
    treasureBox?.isOpen,
    treasureBox?.totalHitpoints,
  ]);

  if (!isClient || !treasureBox) return null;

  return (
    <Layout>
      <DetailsPageNavbar title="Art Reveal" />
      {content}

      <Footer />
    </Layout>
  );
}
