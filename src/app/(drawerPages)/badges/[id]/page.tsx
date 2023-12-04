'use client';

import OwnershipPill from '@/components/Badges/OwnershipPill';
import SwipeUpDrawer from '@/components/Badges/SwipeUpDrawer';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { GAME_ID } from '@/constants/gameId';
import { useClientCheck } from '@/hooks/useClientCheck';
import { useGameState } from '@/hooks/useGameState';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';

type Props = {
  params: { id: string };
};

export default function BadgeDetails({ params }: Props) {
  const { id } = params;
  const { address, isDisconnected } = useAccount();
  const router = useRouter();

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

  const isOwned = useMemo(() => {
    return Boolean(currentBadge?.isCompleted);
  }, [currentBadge]);

  useEffect(() => {
    if (isDisconnected) {
      router.push('/');
    }
  }, [isDisconnected, router]);

  if (!isClient) return null;

  return (
    <>
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
            <DetailsPageNavbar title="View Badge" owned={isOwned} />
          </Box>
          <Box
            sx={{
              filter: isOwned ? 'grayscale(0)' : 'grayscale(1)',
              background: 'var(--Gray, #E3E3E3);',
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
              src={currentBadge.imageUrl.toString()}
              alt={currentBadge.name}
              width={256}
              height={256}
            />
          </Box>
          <OwnershipPill owned={isOwned} />
          <SwipeUpDrawer
            type="badgeActions"
            owned={isOwned}
            title={currentBadge.name}
            completedOn={currentBadge.completedTimestamp}
            latLng={currentBadge.latLng}
            description={currentBadge.description}
            badgeType={currentBadge.type}
            ctaLink={currentBadge.ctaUrl}
          />
        </Stack>
      )}
    </>
  );
}
