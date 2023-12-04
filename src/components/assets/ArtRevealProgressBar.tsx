'use client';

import { GAME_ID } from '@/constants/gameId';
import { UNIT } from '@/constants/unit';
import { useTreasureBox } from '@/hooks/useTreasureBox';
import { Box, LinearProgress, Skeleton, Stack } from '@mui/material';
import { useMemo } from 'react';
import Text from '@/components/Text';

export function ArtRevealProgressBar() {
  const { data: treasureBox, isLoading } = useTreasureBox({
    gameId: GAME_ID,
  });

  const progress = useMemo(() => {
    if (
      !treasureBox?.totalHitpoints ||
      !treasureBox?.currentHitpoints ||
      isLoading
    ) {
      return 0;
    }

    const result =
      Number(treasureBox.currentHitpoints / treasureBox.totalHitpoints) * 100;
    return result < 5 ? 5 : result;
  }, [isLoading, treasureBox?.currentHitpoints, treasureBox?.totalHitpoints]);

  const numericProgress = useMemo(() => {
    return (
      <Stack direction="row" gap="2px" alignItems="center">
        {isLoading ? (
          <Skeleton variant="rectangular" width={73} height={35} />
        ) : (
          <>
            <Text variant="h5">{`${treasureBox?.currentHitpoints.toString()}`}</Text>
            <Box>/</Box>
            <Text variant="body2" noWrap>
              {`${treasureBox?.totalHitpoints.toString()} ${UNIT}`}
            </Text>
          </>
        )}
      </Stack>
    );
  }, [isLoading, treasureBox?.currentHitpoints, treasureBox?.totalHitpoints]);

  return (
    <>
      {numericProgress}
      <Box
        sx={{
          borderRadius: '6.25rem',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            borderRadius: '6.25rem',
            height: '10px',
            backgroundColor: '#D5D5D5', // To make the unused part of the progress bar transparent
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'var(--CB-Blue, #0052FF)', // Color for the progress indicator
            },
          }}
        />
      </Box>
    </>
  );
}
