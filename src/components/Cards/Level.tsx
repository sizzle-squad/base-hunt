import { useCallback, useMemo } from 'react';

import { Box, Skeleton, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import Link from '@/components/AnimatedLink';
import Text from '@/components/Text';
import { type Level } from '@/hooks/types';

import SvgSwitcher, { LevelNumber } from '../LevelsBadge';

type Props = {
  currentLevel: LevelNumber | null;
  score: number;
  isLoading?: boolean;
  rank?: string;
};

export function Level({ currentLevel, score, isLoading, rank }: Props) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (isLoading) return;

    return router.push('/levels');
  }, [isLoading, router]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <Stack gap={2}>
          <Skeleton variant="rounded" width={65} height={65} />
          <Stack gap={2}>
            <Stack gap={0.5}>
              <Skeleton variant="text" width={100} height={30} />
              <Skeleton variant="text" width={75} height={20} />
            </Stack>
          </Stack>
        </Stack>
      );
    }

    return (
      <Stack flexDirection="column" alignItems="flex-start" gap={1.5}>
        <SvgSwitcher
          alt={`Level ${currentLevel || 'Level badge'} Badge`}
          level={currentLevel}
          width={64}
          height={64}
        />
        <Box>
          <Text variant="h6">Level {currentLevel}</Text>
          <Stack
            direction="row"
            gap={1}
            justifyContent="center"
            alignItems="center"
          >
            <Text variant="body2">{`${score} pts`}</Text>
            <Text variant="body2">•</Text>
            <Text variant="body2">{`Rank ${rank ? `#${rank}` : 'N/A'}`}</Text>
          </Stack>
        </Box>
      </Stack>
    );
  }, [currentLevel, isLoading, rank, score]);

  return (
    <Stack
      justifyContent="space-between"
      sx={{
        alignItems: 'flex-start',
        borderRadius: '8px',
        backgroundColor: 'var(--White, #fff)',
        padding: '16px',
        height: '160px',
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={handlePress}
    >
      <Stack width="160px">{content}</Stack>
    </Stack>
  );
}
