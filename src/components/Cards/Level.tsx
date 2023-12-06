import { type Level } from '@/hooks/types';
import { Box, Stack, Skeleton } from '@mui/material';
import { useMemo } from 'react';
import Text from '@/components/Text';

import SvgSwitcher, { LevelNumber } from '../LevelsBadge';
import Link from '@/components/AnimatedLink';

type Props = {
  currentLevel: LevelNumber | null;
  isLoading?: boolean;
};

export function Level({ currentLevel, isLoading }: Props) {
  const content = useMemo(() => {
    if (isLoading) {
      return <Skeleton variant="text" width={100} height={20} />;
    }

    return (
      <Text fontSize="16px" whiteSpace="nowrap">
        Reward Level {currentLevel}
      </Text>
    );
  }, [currentLevel, isLoading]);

  return (
    <Stack
      justifyContent="space-between"
      sx={{
        alignItems: 'flex-start',
        borderRadius: '8px',
        backgroundColor: 'var(--White, #fff)',
        padding: '12px 16px',
        height: '44px',
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <Link href="/levels">
        <Stack width="144px">
          {content}
          {currentLevel && (
            <Box
              sx={{
                position: 'absolute',
                right: '-16.5px',
                top: '-10px',
              }}
            >
              <SvgSwitcher
                alt={`Level ${currentLevel || 'Level badge'} Badge`}
                level={currentLevel || null}
                width={64}
                height={64}
              />
            </Box>
          )}
        </Stack>
      </Link>
    </Stack>
  );
}
