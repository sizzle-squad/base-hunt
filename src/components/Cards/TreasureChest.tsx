'use client';

import { Stack, Card, CardMedia } from '@mui/material';
import Text from '@/components/Text';
import { ArtRevealProgressBar } from '../assets/ArtRevealProgressBar';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../assets/Button';
import { RevealedCard } from '../assets/RevealedCard';
import { useScore } from '@/hooks/useScore';
import { useAccount } from 'wagmi';
import { Color } from '@/constants/color';

type Props = {
  isOpen?: boolean;
  ctaUrl?: string;
};

export function TreasureChest({ isOpen, ctaUrl }: Props) {
  const router = useRouter();
  // Copied from NavBarClient
  const { address, isDisconnected, isConnecting } = useAccount();
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';

  const { data, isLoading: isScoreLoading } = useScore({
    userAddress: address ?? '',
    gameId,
  });

  const score = useMemo(() => {
    if (data && data.score?.currentScore) {
      return data.score.currentScore;
    }

    return 0;
  }, [data]);

  return (
    <Card
      sx={{
        p: '20px',
        borderRadius: '12px',
        bgcolor: 'black',
        overflow: 'visible',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        gap="16px"
      >
        <ArtRevealProgressBar />
      </Stack>
    </Card>
  );
}
