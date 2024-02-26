import { useCallback, useMemo } from 'react';

import { Box, Skeleton, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import Text from '@/components/Text';

type Props = {
  name?: string;
  position?: number;
  isLoading?: boolean;
  imageUrl?: string | null;
  id?: string | null;
  address: `0x${string}` | undefined;
  gameId: string;
};

export function Guild({
  name,
  position,
  imageUrl = '/images/plus.png',
  isLoading,
  id,
}: Props) {
  const router = useRouter();

  const redirectParams = useMemo(() => {
    if (id) {
      return `/guild/${id}`;
    }
    return '/leaderboard/guild?hasNoGuild=true';
  }, [id]);

  const handlePress = useCallback(() => {
    if (isLoading) return;

    return router.push(redirectParams);
  }, [isLoading, redirectParams, router]);

  const positionString = useMemo(() => {
    if (!position) return 'Join a guild';

    let message = 'place';
    switch (position) {
      case 1:
        return `${position}st ${message}`;
      case 2:
        return `${position}nd ${message}`;
      case 3:
        return `${position}rd ${message}`;
      default:
        return `${position}th ${message}`;
    }
  }, [position]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <Stack gap={2}>
          <Skeleton variant="rounded" width={65} height={65} />
          <Stack gap={2}>
            <Stack gap={0.5}>
              <Skeleton variant="text" width={150} height={30} />
              <Skeleton variant="text" width={100} height={20} />
            </Stack>
          </Stack>
        </Stack>
      );
    }

    return (
      <Stack flexDirection="column" alignItems="flex-start" gap={1.5}>
        <Box
          sx={{
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <Image
            src={imageUrl ?? '/images/plus.png'}
            alt="Guild badge"
            width={64}
            height={64}
          />
        </Box>
        <Box gap={0.5}>
          <Text variant="h6" fontSize="18px">
            {name ?? 'Solo player'}
          </Text>
          <Stack direction="row" gap={0.5}>
            <Text variant="body2">{positionString}</Text>
          </Stack>
        </Box>
      </Stack>
    );
  }, [imageUrl, isLoading, name, positionString]);

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
