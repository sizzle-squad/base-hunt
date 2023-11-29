'use client';

import { useClientCheck } from '@/hooks/useClientCheck';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material';
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
import { UNIT } from '@/constants/unit';
import { Card } from '@/components/assets/Card';
import Text from '@/components/Text';
import Stepper from '@/components/Reveal/Stepper';

const imageUrl = '@/assets/images/map.png';

// hydration issue without dynamic import
const Navbar = dynamic(() => import('@/components/navigation/navbar'), {
  ssr: false,
});

const TreasureChestInfo = [
  {
    title: 'A collaborative challenge',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit.',
    cta: 'Next',
  },
  {
    title: 'Once per day',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit.',
    cta: 'Next',
  },
  {
    title: 'Exclusive art from secret artist',
    description:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit.',
    cta: 'Dismiss',
  },
] as const;

export default function ArtReveal() {
  const [activeInfoStep, setActiveInfoStep] = useState<number>(0);
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

  useEffect(() => {
    const savedStep = window.localStorage.getItem('artRevealInfoStep');
    if (
      savedStep &&
      savedStep < TreasureChestInfo[TreasureChestInfo.length - 1].title
    ) {
      setActiveInfoStep(Number(savedStep));
    }
  }, []);

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

  const handleInfoStepChange = useCallback((step: number) => {
    if (step === TreasureChestInfo.length + 1) {
      return;
    }
    setActiveInfoStep(step);
    window.localStorage.setItem('artRevealInfoStep', String(step));
  }, []);

  const CardContent = memo(() => (
    <>
      {activeInfoStep && activeInfoStep >= 3 ? (
        <ProgressCard
          ctaText={`Tap to reveal (${score} ${UNIT})`}
          onPress={handleCTAPress}
          currentPoints={treasureBox?.currentHitpoints}
          totalPoints={treasureBox?.totalHitpoints}
        />
      ) : (
        <Card>
          <Grid container>
            <Grid item xs={4}>
              <Stepper
                activeStep={activeInfoStep}
                onClick={handleInfoStepChange}
              />
            </Grid>
          </Grid>
          <Text variant="h6" fontSize="20px">
            {TreasureChestInfo[activeInfoStep].title}
          </Text>
          <Text>{TreasureChestInfo[activeInfoStep].description}</Text>
          <Button
            onClick={() => handleInfoStepChange(activeInfoStep + 1)}
            sx={{
              ':hover': {
                backgroundColor: 'black',
                color: 'white',
              },
              color: `${
                activeInfoStep === TreasureChestInfo.length - 1
                  ? 'black'
                  : 'black'
              }`,
              background: `${
                activeInfoStep === TreasureChestInfo.length - 1
                  ? 'black'
                  : 'var(--Darker-Gray, #D5D5D5)'
              }`,
            }}
          >
            <Text
              color="inherit"
              sx={{
                color: `${
                  activeInfoStep === TreasureChestInfo.length - 1
                    ? 'white'
                    : 'black'
                }`,
              }}
            >
              {TreasureChestInfo[activeInfoStep].cta}
            </Text>
          </Button>
        </Card>
      )}
    </>
  ));

  CardContent.displayName = 'CardContent';

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
            {treasureBox?.isOpen ? <ArtRevealClient /> : <CardContent />}
          </>
        )}
      </Stack>
    );
  }, [
    handleCTAPress,
    isLoading,
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
