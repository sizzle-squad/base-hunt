import { type Level } from '@/hooks/types';
import { Box, Stack, Skeleton } from '@mui/material';
import { useMemo } from 'react';
import Text from '@/components/Text';

import SvgSwitcher from '../LevelsBadge';
import Link from 'next/link';

type Props = {
  currentLevel?: Level | null;
  isLoading?: boolean;
};

export function Level({ currentLevel, isLoading }: Props) {
  const content = useMemo(() => {
    if (isLoading || !currentLevel) {
      return <Skeleton variant="text" width={100} height={20} />;
    }

    return <Text whiteSpace="nowrap">Level {currentLevel.level}</Text>;
  }, [currentLevel, isLoading]);

  return (
    <Stack
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        borderRadius: '8px',
        backgroundColor: 'var(--White, #fff)',
        padding: '12px 16px',
        justifyContent: 'space-between',
        height: '44px',
        width: '100%',
        flexDirection: 'column',
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <Link href="/levels">
        {content}
        {currentLevel?.level && (
          <Box
            sx={{
              position: 'absolute',
              right: '-16.5px',
              top: '-10px',
            }}
          >
            <SvgSwitcher
              alt={`Level ${currentLevel.level || 'Level badge'} Badge`}
              level={(currentLevel?.level as Level['level']) || null}
              width={64}
              height={64}
            />
          </Box>
        )}
      </Link>
    </Stack>
  );
}
