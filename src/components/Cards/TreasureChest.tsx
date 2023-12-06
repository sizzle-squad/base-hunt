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

  const handleCTAPress = useCallback(() => {
    router.push('/art-reveal');
  }, [router]);

  const progressContent = useMemo(() => {
    const contribution = score && score > 0 ? ` (${score} pts) ` : ' ';

    if (!isOpen) {
      return (
        <>
          <ArtRevealProgressBar />
          <Button onClick={handleCTAPress}>
            <Text color="#fff">{`Contribute${contribution}to reveal`}</Text>
          </Button>
        </>
      );
    }
    return <RevealedCard ctaLink={ctaUrl} />;
  }, [ctaUrl, handleCTAPress, isOpen, score]);

  return (
    <Card
      sx={{
        p: '20px',
        borderRadius: '12px',
        bgcolor: 'white',
        overflow: 'visible',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        gap="16px"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={0}
          position="relative"
        >
          <Text variant="h5" fontSize="24px">
            Art Reveal
          </Text>
          <CardMedia
            component="img"
            image="https://cdn.builder.io/api/v1/image/assets/TEMP/dfb3e45a-8ea6-43a3-b768-5070d4c9fc04?"
            sx={{
              position: 'absolute',
              top: '5px',
              right: 0,
              width: 72,
              objectFit: 'contain',
              flexShrink: 0,
              display: isOpen ? 'none' : 'block',
            }}
          />
        </Stack>
        {progressContent}
      </Stack>
    </Card>
  );
}
