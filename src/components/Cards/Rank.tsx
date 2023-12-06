import { Skeleton, Stack } from '@mui/material';
import { useMemo } from 'react';
import Text from '../Text';
import Link from '@/components/AnimatedLink';
import { HideIfOverflows } from '../HideIfOverflow';

type Props = {
  currentRank?: string | null;
  isLoading?: boolean;
  score: number;
};

export function Rank({ currentRank, isLoading, score }: Props) {
  const position = useMemo(() => {
    return currentRank ? `#${currentRank}` : 'Unranked';
  }, [currentRank]);

  const content = useMemo(() => {
    if (isLoading) {
      return <Skeleton variant="text" width={100} height={20} />;
    }

    return (
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          margin: '0 auto',
          justifyContent: 'space-between',
        }}
        gap={3}
      >
        <Stack flexDirection="row" gap="4px">
          <Text
            fontSize="16px"
            sx={{
              display: ['none', 'block'],
            }}
          >
            Rank
          </Text>
          <Text fontSize="16px">{position}</Text>
        </Stack>
        <Stack flexDirection="row" alignItems="center" gap="4px">
          <Text fontSize="16px" noWrap>
            {score}
          </Text>
          <Text
            fontSize="16px"
            noWrap
            sx={{
              display: ['none', 'block'],
            }}
          >
            points
          </Text>
        </Stack>
      </Stack>
    );
  }, [isLoading, position]);

  return (
    <Stack
      justifyContent="space-between"
      borderRadius="8px"
      bgcolor="var(--White, #fff)"
      display="flex"
      spacing={2}
      padding="12px 12px 12px 16px"
      sx={{ width: '100%', cursor: 'pointer' }}
      flex={1}
      height="44px"
    >
      <Link href="/leaderboard">{content}</Link>
    </Stack>
  );
}
