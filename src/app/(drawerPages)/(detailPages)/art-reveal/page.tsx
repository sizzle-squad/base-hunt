'use client';

import Layout from '@/components/layout';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  AlertColor,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Stack,
} from '@mui/material';
import { useMutateTreasureBox } from '@/hooks/useMutateTreasureBox';
import { GAME_ID } from '@/constants/gameId';
import { useAccount } from 'wagmi';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useTreasureBox } from '@/hooks/useTreasureBox';
import { ProgressCard } from '@/components/assets/ProgressCard';
import { useScore } from '@/hooks/useScore';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import ArtRevealClient from './ArtRevealClient';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { UNIT } from '@/constants/unit';
import { Card } from '@/components/assets/Card';
import Text from '@/components/Text';
import Stepper from '@/components/Reveal/Stepper';
import debounce from 'lodash.debounce';
import accurateInterval from 'accurate-interval';

const TreasureChestInfo = [
  {
    title: 'A collaborative challenge',
    description: `All players use their points from boosts and art colleciton to reveal the secret artwork by clicking "Tap to Reveal".`,
    cta: 'Next',
  },
  {
    title: 'Once per day',
    description: `Collect points throughout the day and click "Tap to Reveal" once per day to contribute your points to the reveal.`,
    cta: 'Next',
  },
  {
    title: 'Exclusive art from secret artist',
    description: `If enough points are contributed throughout the game, the secret artwork will be revealed. All contributers can mint the secret artwork once revealed.`,
    cta: 'Dismiss',
  },
] as const;

type StatusToast = {
  show: boolean;
  type: AlertColor;
  message: string;
};

export default function ArtReveal() {
  const [activeInfoStep, setActiveInfoStep] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = accurateInterval(
      () => {
        setCurrentTime(new Date());
      },
      1000,
      { aligned: true, immediate: true }
    ); // Update every second

    return () => interval.clear(); // Clean up the interval
  }, []);

  const physicalTapMulitplier = parseFloat(
    process.env.NEXT_PUBLIC_PHYSICAL_TAP_MULTIPLIER ?? '1'
  );
  const [statusToast, setStatusToast] = useState<StatusToast>({
    show: false,
    type: 'success',
    message: 'Your tap was successful!',
  });

  const router = useRouter();
  const { address } = useAccount();
  const { data: userPublicProfile } = useCBProfile({ address });
  const { data } = useScore({
    userAddress: address ?? '',
    gameId: GAME_ID,
  });

  const { attackBox } = useMutateTreasureBox({ gameId: GAME_ID });

  const {
    data: treasureBox,
    isLoading,
    stateData,
    stateDataIsLoading,
    stateError,
  } = useTreasureBox({
    gameId: GAME_ID,
    userAddress: address ?? '',
  });
  const searchParams = useSearchParams();
  const iykRef = searchParams.get('iykRef');

  const score = useMemo(() => {
    if (data && data.score?.currentScore) {
      return data.score.currentScore;
    }

    return 0;
  }, [data]);

  const boostedLabel = useMemo(() => {
    if (iykRef) {
      return ` x ${physicalTapMulitplier} boost`;
    }

    return '';
  }, [iykRef, physicalTapMulitplier]);

  const handleCTAPress = useCallback(
    debounce(() => {
      attackBox.mutate({
        gameId: GAME_ID,
        user: {
          address: address!,
          cbId: userPublicProfile?.subdomainProfile?.name,
          ensName: userPublicProfile?.ensDomainProfile?.name,
        },
        ...(iykRef && { iykRef }),
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
    if (attackBox.isSuccess) {
      setStatusToast({
        show: true,
        type: 'success',
        message: 'Your tap was successful!',
      });
    }

    if (attackBox.isError) {
      setStatusToast({
        show: true,
        type: 'error',
        message:
          attackBox.error.response.data.error ??
          'Tap was unsuccessful. Please try again.',
      });
    }
  }, [attackBox.isLoading, attackBox.isSuccess, attackBox.isError]);

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

  const handleClose = useCallback(() => {
    setStatusToast((prev) => ({
      ...prev,
      show: false,
    }));
  }, []);

  const nextClick = useMemo(() => {
    if (stateData?.nextEligibleDate) {
      const nextEligibleDate = new Date(stateData.nextEligibleDate);
      const timeLeft = nextEligibleDate.getTime() - currentTime.getTime();
      if (timeLeft > 0) {
        // Calculate hours, minutes, seconds
        const hours = Math.floor(timeLeft / 3600000); // 1 hour = 3600000 milliseconds
        const minutes = Math.floor((timeLeft % 3600000) / 60000); // 1 minute = 60000 milliseconds
        const seconds = Math.floor((timeLeft % 60000) / 1000); // 1 second = 1000 milliseconds

        // Format to "HH:mm:ss"
        const formattedTime = [hours, minutes, seconds]
          .map((unit) => String(unit).padStart(2, '0'))
          .join(':');
        return formattedTime;
      } else {
        return null;
      }
    }
    return null;
  }, [stateData, currentTime]);
  const CardContent = memo(() => (
    <>
      {activeInfoStep && activeInfoStep >= 3 ? (
        <ProgressCard
          isCTADisabled={score === 0 || stateData?.isCTAEligible === false}
          ctaText={`Tap to reveal (${score} ${UNIT}${boostedLabel})`}
          onPress={handleCTAPress}
          isLoading={attackBox.isLoading}
          nextClick={nextClick}
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
        paddingTop={6}
        paddingBottom={8}
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
                padding: '20px',
                position: 'relative',
                boxShadow:
                  '0px 0.5px 0.5px 0px rgba(0, 0, 0, 0.04), 0px 1px 1px 0px rgba(0, 0, 0, 0.05), 0px 2px 2px 0px rgba(0, 0, 0, 0.06), 0px 4px 4px 0px rgba(0, 0, 0, 0.07), 0px 8px 8px 0px rgba(0, 0, 0, 0.08), 0px 16px 16px 0px rgba(0, 0, 0, 0.10)',
                marginBottom: '20px',
                marginTop: '25px',
              }}
            >
              <Image
                src={'/images/blurred-art-reveal.gif' as string}
                alt="jumbotron"
                sizes="100vw"
                fill
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
      <Snackbar
        open={statusToast.show}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={statusToast.type}>
          {statusToast.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
}
