'use client';
import { useEffect, useMemo, useState } from 'react';

import { Box, Grid, Skeleton, Stack } from '@mui/material';
import Image from 'next/image';

import { CountdownTimer } from '@/components/Countdown';
import Text from '@/components/Text';
import useScreenSize from '@/hooks/useScreenSize';
import { useTreasureBoxForRevealScreen } from '@/hooks/useTreasureBoxForRevealScreen';
import RevealGif from '@public/images/blurred-art-reveal.gif';

export default function ArtRevealScreen() {
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';
  const { data } = useTreasureBoxForRevealScreen({
    gameId,
  });
  const screenSize = useScreenSize();
  const imageDimensions = useMemo(() => {
    const baseWidth = 120; // base width for small
    const baseHeight = 200; // base height for small (3:5 aspect ratio)

    let multiplier;
    if (screenSize === 'small') {
      multiplier = 1;
    } else if (screenSize === 'medium') {
      multiplier = 1.5;
    } else {
      // large
      multiplier = 3;
    }

    const width = baseWidth * multiplier;
    const height = baseHeight * multiplier;

    return { width, height };
  }, [screenSize]);

  const lerp = (start: number, end: number, alpha: number) =>
    start + (end - start) * alpha;

  const [animatedHitpoints, setAnimatedHitpoints] = useState<number>(0);

  useEffect(() => {
    if (data?.currentHitpoints != null) {
      const animate = () => {
        setAnimatedHitpoints((prev: number) => {
          const distance = data.currentHitpoints - prev;
          const alpha = Math.max(
            0.02,
            0.1 * (Number(distance) / data.currentHitpoints)
          );
          const newValue = lerp(prev, data.currentHitpoints, alpha);

          if (Math.abs(newValue - data.currentHitpoints) < 0.5) {
            return data.currentHitpoints;
          }

          requestAnimationFrame(animate);
          return newValue;
        });
      };
      animate();
    }
  }, [data?.currentHitpoints]);
  return (
    <Stack
      width="100%"
      margin="auto"
      alignItems="center"
      p="20px"
      gap="20px"
      bgcolor="black"
      height="100vh"
      justifyContent="center"
    >
      <Stack>
        <CountdownTimer fontSize="40px" color="white" />
      </Stack>
      <Image
        alt="art reveal gif"
        unoptimized
        src={RevealGif}
        width={imageDimensions.width}
        height={imageDimensions.height}
      />
      <Stack flexDirection="row" justifyContent="center">
        <Stack
          width="100%"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <>
            <Text useMonoFont fontSize="40px" color="white">
              {Math.round(animatedHitpoints) || 0}
            </Text>
            <Text fontSize="40px" color="white">
              /
            </Text>
            <Text useMonoFont fontSize="40px" color="white">
              {(data && data?.totalHitpoints) || 0}
            </Text>
          </>
        </Stack>
      </Stack>
    </Stack>
  );
}
