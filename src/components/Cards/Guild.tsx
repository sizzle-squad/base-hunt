import { useMemo } from 'react';

import { Box, Skeleton, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import Image from 'next/image';
import Link from '@/components/AnimatedLink';
import Text from '@/components/Text';

type Props = {
  name: string;
  position: string;
  isLoading?: boolean;
  imageUrl?: string;
};

export function Guild({
  name,
  position,
  imageUrl = '/images/solo.svg',
  isLoading,
}: Props) {
  const router = useRouter();

  const content = useMemo(() => {
    if (isLoading) {
      return <Skeleton variant="text" width={100} height={20} />;
    }

    return (
      <Stack flexDirection="column" alignItems="flex-start" gap={1.5}>
        <Image
          src={!name || !position ? '/images/solo.svg' : imageUrl}
          alt="Guild badge"
          width={64}
          height={64}
        />
        <Box>
          <Text variant="h5">{name ? name : 'Solo player'}</Text>
          <Text variant="body2">
            {position ? `${position} place` : 'No guild'}
          </Text>
        </Box>
      </Stack>
    );
  }, [imageUrl, isLoading, name, position]);

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
