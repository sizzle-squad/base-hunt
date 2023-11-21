'use client';

import OwnershipPill from '@/components/Badges/OwnershipPill';
import SwipeUpDrawer from '@/components/Badges/SwipeUpDrawer';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
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

export default function BadgeDetails({ params }: Props) {
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

  const isOwned =
    useMemo(() => {
      return currentBadge?.isCompleted;
    }, [currentBadge]) ?? false;

  if (!isClient) return null;

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error...</div>}
      {currentBadge && (
        <Stack
          sx={{
            height: '100vh',
            widows: '100vw',
            color: 'white',
            background: isOwned
              ? 'linear-gradient(180deg, #0A0B0D 0%, #26292F 100%)'
              : 'var(--Gray, #E3E3E3);',
            alignItems: 'center',
          }}
        >
          <Box marginTop="24px" width="100%">
            <DetailsPageNavbar title="View Badge" />
          </Box>
          <Box
            sx={{
              filter: isOwned ? 'grayscale(0)' : 'grayscale(1)',
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

          <OwnershipPill owned={isOwned} />

          <SwipeUpDrawer
            type="badgeActions"
            owned={isOwned}
            title={currentBadge?.name ?? 'Some NFT Title'}
            completedOn={currentBadge?.completedTimestamp}
            mapURL={
              currentBadge?.ctaUrl ??
              'https://maps.app.goo.gl/51g9q5AzvsQQUPan9'
            }
            // todo: add labels
            labels={[]}
            description={
              currentBadge?.description || 'In the bustling heart of Miami.'
            }
          />
        </Stack>
      )}
    </>
  );
}
