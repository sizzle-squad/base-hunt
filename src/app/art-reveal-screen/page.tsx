'use client';
import { Box, Grid, Skeleton, Stack } from '@mui/material';
import Text from '@/components/Text';
import { CountdownTimer } from '@/components/ArtRevealScreen/Countdown';
import { useTreasureBoxForRevealScreen } from '@/hooks/useTreasureBoxForRevealScreen';
import { useEffect, useState } from 'react';

export default function ArtRevealScreen() {
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';
  const { data } = useTreasureBoxForRevealScreen({
    gameId,
  });

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
    <Stack width="100%" margin="auto">
      <Stack>
        <CountdownTimer />
      </Stack>
      <Stack flexDirection="row" justifyContent="center">
        <Stack
          width="100%"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <>
            <Text useMonoFont fontSize="180px">
              {Math.round(animatedHitpoints) || 0}
            </Text>
            <Text fontSize="180px">/</Text>
            <Text useMonoFont fontSize="180px">
              {(data && data?.totalHitpoints) || 0}
            </Text>
          </>
        </Stack>
      </Stack>
    </Stack>
  );
}
