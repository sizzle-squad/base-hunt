import { useMemo } from 'react';

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
};

export function Level({ currentLevel, score, isLoading }: Props) {
  const router = useRouter();

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
          <Text variant="h5">Level {currentLevel}</Text>
          <Text variant="body2">{`${score} points`}</Text>
        </Box>
      </Stack>
    );
  }, [currentLevel, isLoading, score]);

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
      onClick={() => router.push('/levels')}
    >
      <Link href="/levels">
        <Stack width="160px">{content}</Stack>
      </Link>
    </Stack>
  );
}
