'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Drawer, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';

import Hero from '@/components/Badges/Hero';
import { Level } from '@/components/Cards/Level';
import Circle from '@/components/Circle';
import Text from '@/components/Text';
import { GAME_ID } from '@/constants/gameId';
import { useDrawer } from '@/context/DrawerContext';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useClientCheck } from '@/hooks/useClientCheck';
import { useGameState } from '@/hooks/useGameState';
import { useLevels } from '@/hooks/useLevels';
import { useRank } from '@/hooks/useRank';
import { useScore } from '@/hooks/useScore';
import { useUserName } from '@/hooks/useUsername';

import { Guild } from '@/components/Cards/Guild';
import { useGuildState } from '@/hooks/useGuildState';
import ChallengesPageClient from './ChallengesClient';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function Challenges() {
  const router = useRouter();
  const { address, isConnected, isDisconnected } = useAccount();
  const { drawerStates, toggleDrawer } = useDrawer();
  const { data: userPublicProfile } = useCBProfile({ address });
  const userName = useUserName({ address, userPublicProfile });
  const { disconnectAsync } = useDisconnect();
  const {
    data: badges,
    isLoading,
    error,
  } = useGameState({ userAddress: address, gameId: GAME_ID });
  const {
    data: guildState,
    isLoading: isGuildStateLoading,
    error: guildStateError,
    hasGuild,
  } = useGuildState({
    gameId: GAME_ID,
    userAddress: address,
  });

  const {
    data: collection,
    isLoading: isLevelsLoading,
    error: levelsError,
    refetch: refetchLevels,
  } = useLevels({ gameId: GAME_ID, address: address ?? '' });

  const {
    data: rank,
    isLoading: isRankLoading,
    refetch: refetchRank,
  } = useRank({
    userAddress: address ?? '',
    gameId: GAME_ID,
  });

  const {
    data,
    isLoading: isScoreLoading,
    refetch: refetchScore,
  } = useScore({
    userAddress: address ?? '',
    gameId: GAME_ID,
  });

  const refetches = useCallback(() => {
    refetchLevels();
    refetchRank();
    refetchScore();
  }, [refetchLevels, refetchRank, refetchScore]);

  const score = useMemo(() => {
    if (data && data.score?.currentScore) {
      return data.score.currentScore;
    }

    return 0;
  }, [data]);

  const handleDisconnect = useCallback(async () => {
    await disconnectAsync();
    router.push('/');
  }, [disconnectAsync, router]);

  const handleDrawerDismiss = useCallback(() => {
    toggleDrawer('walletOperations', 'bottom', false);
  }, [toggleDrawer]);

  const handleToggleDrawer = useCallback(
    (anchor: Anchor) => {
      toggleDrawer(
        'walletOperations',
        anchor,
        drawerStates.walletOperations[anchor]
      );
    },
    // Adding walletOperations to the dependency array causes toggleDrawer always set to true
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggleDrawer]
  );

  useEffect(() => {
    if (isDisconnected) {
      router.push('/');
    }
  }, [isDisconnected, router]);

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
        display: 'flex',
        padding: '1.5rem 1.25rem',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '1.5rem',
        alignSelf: 'stretch',
        background: '#E3E3E3',
        boxShadow: '0px -12px 24px 0px rgba(0, 0, 0, 0.10)',
        backdropFilter: 'blur(4px)',
      }}
      role="presentation"
    >
      <Stack flexDirection="row" justifyContent="space-between" width="100%">
        <Text variant="h3" fontSize="1.25rem">
          Wallet
        </Text>
        <Box
          onClick={handleDrawerDismiss}
          sx={{
            cursor: 'pointer',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
          >
            <rect
              y="0.5"
              width="24"
              height="24"
              rx="12"
              fill="black"
              fillOpacity="0.2"
            />
            <path
              d="M16 8.5L8 16.5M8 8.5L16 16.5"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </Box>
      </Stack>
      {isConnected && address && (
        <Stack width="100%" gap={2}>
          <Text variant="h3" fontSize="1.5rem">
            Connected Wallet
          </Text>
          <Box
            sx={{
              justifyContent: 'space-between',
              borderRadius: '0.75rem',
              backgroundColor: '#fff',
              display: 'flex',
              width: '100%',
              gap: '20px',
              margin: '16px -20px 0 0',
              padding: '12px 16px',
            }}
          >
            {/* ... content of Div3 */}
            <Box width="100%">
              <Stack
                flexDirection="row"
                gap="0.5rem"
                alignItems="center"
                width="100%"
                sx={{
                  borderRadius: '0.75rem',
                  backgroundColor: '#fff',
                }}
              >
                <Circle color="#FFC52D" size="2rem" />
                {userName && <Text fontSize="0.875rem">{userName}</Text>}
              </Stack>
            </Box>
          </Box>
          <Stack
            flexDirection="row"
            gap="0.5rem"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            onClick={handleDisconnect}
            sx={{
              cursor: 'pointer',
              borderRadius: '0.75rem',
              backgroundColor: '#0A25A5',
              padding: '1.25rem 1.5rem',
            }}
          >
            <Text color="white" fontSize="1rem">
              Disconnect wallet
            </Text>
            <Box>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.9994 7.99963L20.9994 11.9996M20.9994 11.9996L16.9994 15.9996M20.9994 11.9996H8.99942M11.9994 2.99963H6.2002C5.08009 2.99963 4.52004 2.99963 4.09222 3.21762C3.71589 3.40937 3.40993 3.71533 3.21819 4.09165C3.0002 4.51948 3.0002 5.07953 3.0002 6.19963V17.7996C3.0002 18.9197 3.0002 19.4798 3.21819 19.9076C3.40993 20.2839 3.71589 20.5899 4.09222 20.7816C4.52004 20.9996 5.08009 20.9996 6.2002 20.9996H11.9994"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="square"
                />
              </svg>
            </Box>
          </Stack>
        </Stack>
      )}
    </Box>
  );

  return (
    <Stack
      paddingX="1.25rem"
      gap="12px"
      paddingBottom="6rem"
      className="pageContent"
    >
      <Hero />
      <Stack
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-start"
        gap="10px"
        alignSelf="stretch"
      >
        <Level
          currentLevel={
            collection.currentLevelIdx !== null
              ? collection.levels[collection.currentLevelIdx]?.level ??
                undefined
              : '0'
          }
          isLoading={isLevelsLoading || isRankLoading || isScoreLoading}
          score={score as number}
          rank={rank?.rank}
        />
        <Guild
          name={guildState?.name}
          position={guildState?.currentDailyRank}
          isLoading={isGuildStateLoading}
          imageUrl={guildState?.imageUrl}
          id={guildState?.guildId}
        />
      </Stack>
      <Box>
        {(['bottom'] as const).map((anchor) => (
          <Fragment key={anchor}>
            <Drawer
              anchor={anchor}
              open={drawerStates.walletOperations[anchor]}
              onClose={() => handleToggleDrawer(anchor)}
            >
              {list(anchor)}
            </Drawer>
          </Fragment>
        ))}
      </Box>
      <ChallengesPageClient refreshData={refetches} />
    </Stack>
  );
}
