'use client';

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
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ArtRevealClient from './ArtRevealClient';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { UNIT } from '@/constants/unit';
import { Card } from '@/components/assets/Card';
import Text from '@/components/Text';
import Stepper from '@/components/Reveal/Stepper';
import debounce from 'lodash.debounce';
import { useProgress } from '@/context/NavigationContext';

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
  const [activeInfoStep, setActiveInfoStep] = useState(0);
  const { setProgress } = useProgress();
  const router = useRouter();
  const { address } = useAccount();
  const { data: userPublicProfile } = useCBProfile({ address });
  const { data } = useScore({
    userAddress: address ?? '',
    gameId: GAME_ID,
  });

  useEffect(() => {
    setProgress(0);
  }, []);

  const score = useMemo(() => {
    if (data && data.score?.currentScore) {
      return data.score.currentScore;
    }

    return 0;
  }, [data]);

  const { attackBox } = useMutateTreasureBox();

  const { data: treasureBox, isLoading } = useTreasureBox({ gameId: GAME_ID });

  const handleCTAPress = useCallback(
    debounce(() => {
      attackBox.mutate({
        gameId: GAME_ID,
        user: {
          address: address!,
          cbId: userPublicProfile?.subdomainProfile?.name,
          ensName: userPublicProfile?.ensDomainProfile?.name,
        },
      });
    }, 500),
    [
      address,
      // attackBox,
      userPublicProfile?.ensDomainProfile?.name,
      userPublicProfile?.subdomainProfile?.name,
    ]
  );

  useEffect(() => {
    return () => {
      handleCTAPress.cancel();
    };
  }, [handleCTAPress]);

  useEffect(() => {
    const savedStep = window.localStorage.getItem('artRevealInfoStep');
    if (
      savedStep &&
      savedStep < TreasureChestInfo[TreasureChestInfo.length - 1].title
    ) {
      setActiveInfoStep(Number(savedStep));
    }
  }, []);

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
          isCTADisabled={score === 0}
          ctaText={`Tap to reveal (${score} ${UNIT})`}
          onPress={handleCTAPress}
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
          <Text color="#1D1818" variant="h6" fontSize="20px">
            {TreasureChestInfo[activeInfoStep].title}
          </Text>
          <Text color="#1D1818">
            {TreasureChestInfo[activeInfoStep].description}
          </Text>
          <Button
            onClick={() => handleInfoStepChange(activeInfoStep + 1)}
            sx={{
              ':hover': {
                backgroundColor: 'black',
                color: 'white',
              },
              ':active': {
                backgroundColor: 'black',
                color: 'white',
              },
              ':focused': {
                backgroundColor: 'black',
                color: 'white',
              },
              color: `${
                activeInfoStep === TreasureChestInfo.length - 1
                  ? 'white'
                  : 'black'
              }`,
              background: `${
                activeInfoStep === TreasureChestInfo.length - 1
                  ? 'black'
                  : 'var(--Darker-Gray, #D5D5D5)'
              }`,
            }}
          >
            <Text color="inherit">{TreasureChestInfo[activeInfoStep].cta}</Text>
          </Button>
        </Card>
      )}
    </>
  ));

  CardContent.displayName = 'CardContent';

  const content = useMemo(() => {
    return (
      <Stack
        className="pageContent"
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
  }, [CardContent, isLoading, treasureBox?.isOpen]);

  if (!treasureBox) return null;

  return (
    <Layout>
      <DetailsPageNavbar title="Art Reveal" />
      {content}
    </Layout>
  );
}
