'use client';

import { useMemo } from 'react';

import { Box, LinearProgress, Skeleton, Stack } from '@mui/material';
import { useAccount } from 'wagmi';

import Text from '@/components/Text';
import { Color } from '@/constants/color';
import { GAME_ID } from '@/constants/gameId';
import { useLevels } from '@/hooks/useLevels';
import { useScore } from '@/hooks/useScore';

export function NextLevelProgressBar() {
  const { address } = useAccount();
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';

  const {
    data: collection,
    isLoading: isLevelsLoading,
    error: levelsError,
  } = useLevels({ gameId: GAME_ID, address: address ?? '' });
  const { data: score, isLoading: isScoreLoading } = useScore({
    userAddress: address ?? '',
    gameId,
  });

  const progress = useMemo(() => {
    if (!score?.score || !score?.nextLevel?.thresholdPoints) return 0;

    const result =
      Number(score.score.currentScore / score.nextLevel.thresholdPoints) * 100;

    return result < 5 ? 5 : result;
  }, [score?.nextLevel?.thresholdPoints, score?.score]);

  const progressBarTitle = useMemo(() => {
    const currentLevel = collection?.currentLevelIdx ?? 0;
    return (
      <Box>
        <Text
          variant="h5"
          fontSize="24px"
          color={Color.Positive}
        >{`You are at Level ${currentLevel ? currentLevel + 1 : 0}`}</Text>
      </Box>
    );
  }, [collection?.currentLevelIdx]);

  const description = useMemo(() => {
    const currentLevel = Number(collection?.currentLevelIdx) ?? 0;
    const offset = currentLevel !== 0 ? 2 : 1;

    if (isLevelsLoading) {
      return <Skeleton variant="text" width={100} height={20} />;
    }

    return (
      <Text
        variant="body1"
        fontSize="16px"
        color={Color.White}
      >{`You need ${score?.nextLevel?.thresholdPoints} points to reach Level ${
        currentLevel + offset
      }`}</Text>
    );
  }, [
    collection?.currentLevelIdx,
    isLevelsLoading,
    score?.nextLevel?.thresholdPoints,
  ]);

  return (
    <>
      {progressBarTitle}
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
            backgroundColor: '#FFFFFF33', // To make the unused part of the progress bar transparent
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'var(--CB-Positive, #00D17F)', // Color for the progress indicator
            },
          }}
        />
      </Box>
      {description}
    </>
  );
}
