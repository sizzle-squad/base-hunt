'use client';

import OwnershipPill from '@/components/Badges/OwnershipPill';
import SwipeUpDrawer from '@/components/Badges/SwipeUpDrawer';
import { GAME_ID } from '@/constants/gameId';
import { useClientCheck } from '@/hooks/useClientCheck';
import { useGameState } from '@/hooks/useGameState';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

interface Props {
  params: { id: string };
}

const TitleBar = () => (
  <Stack alignItems="center" marginTop="24px">
    <Box
      sx={{
        position: 'absolute',
        left: 20,
      }}
    >
      <Link href="/badges">
        <Image
          src="/images/icon-back.png"
          alt="Back Button"
          height={24}
          width={24}
        />
      </Link>
    </Box>
    <Typography
      sx={{
        fontFamily: 'CoinbaseDisplay',
        fontSize: '1.25rem',
        fontWeight: 400,
      }}
    >
      View Badge
    </Typography>
  </Stack>
);

export default function SwipeableEdgeDrawer({ params }: Props) {
  const { id } = params;
  const { address } = useAccount();

  const isClient = useClientCheck();
  const { data, isLoading, error } = useGameState({
    userAddress: address,
    gameId: GAME_ID,
  });

  const { badges } = data;

  const currentBadge = useMemo(() => {
    if (!badges) return null;
    return badges.find((badge) => badge.id === id);
  }, [badges, id]);

  return (
    <Stack
      sx={{
        height: '100vh',
        widows: '100vw',
        color: 'white',
        background: 'linear-gradient(180deg, #0A0B0D 0%, #26292F 100%)',
        alignItems: 'center',
      }}
    >
      <TitleBar />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '32px',
          overflow: 'hidden',
          mt: '120px',
          boxShadow:
            '0px 4px 4px 0px rgba(0, 0, 0, 0.10), 0px 8px 12px 0px rgba(0, 0, 0, 0.10), 0px 24px 32px 0px rgba(0, 0, 0, 0.10)',
        }}
      >
        <Image
          src={currentBadge?.imageUrl.toString() ?? ''}
          alt={currentBadge?.name ?? ''}
          width={256}
          height={256}
        />
      </Box>

      <OwnershipPill owned={currentBadge?.isCompleted ?? false} />

      <SwipeUpDrawer
        type="badgeActions"
        title="Some NFT title"
        description="In the bustling heart of Miami, there's a quaint, vintage bookstore nestled among the modern skyscrapers. Its wooden shelves are filled with old tomes and rare manuscripts, and there's a faint aroma of aged paper and leather."
      />
    </Stack>
  );
}
