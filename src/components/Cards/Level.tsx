import { useMemo } from 'react';

import { Box, Skeleton, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import Link from '@/components/AnimatedLink';
import Text from '@/components/Text';
import { type Level } from '@/hooks/types';


import SvgSwitcher, { LevelNumber } from '../LevelsBadge';

type Props = {
  currentLevel: LevelNumber | null;
  isLoading?: boolean;
};

export function Level({ currentLevel, isLoading }: Props) {
  const router = useRouter();
  const content = useMemo(() => {
    if (isLoading) {
      return <Skeleton variant="text" width={100} height={20} />;
    }

    return (
      <Stack flexDirection="row" alignItems="center" gap="4px">
        <Text
          fontSize="16px"
          noWrap
          sx={{
            textOverflow: 'ellipsis',
          }}
        >
          Merch unlock
        </Text>
      </Stack>
    );
  }, [isLoading]);

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
      onClick={() => router.push('/levels')}
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
