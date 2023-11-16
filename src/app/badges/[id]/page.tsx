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

const TitleBar = ({ owned }: { owned: boolean }) => (
  <Stack alignItems="center" marginTop="24px">
    <Box
      sx={{
        position: 'absolute',
        left: 20,
      }}
    >
      <Link href="/badges">
        <Image
          src={
            owned ? '/images/icon-back-light.png' : '/images/icon-back-dark.png'
          }
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
        color: owned ? '#FFFFFF' : '#1D1818',
      }}
    >
      View Badge
    </Typography>
  </Stack>
);

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
          <TitleBar owned={isOwned} />

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
            mapURL={
              currentBadge?.ctaUrl ??
              'https://maps.app.goo.gl/51g9q5AzvsQQUPan9'
            }
            // todo: add labels
            labels={[]}
            description={
              currentBadge?.description ||
              'In the bustling heart of Miami, blablabla.'
            }
          />
        </Stack>
      )}
    </>
  );
}
