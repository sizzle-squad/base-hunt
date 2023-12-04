'use client';

import CustomAccordion from '@/components/Badges/Accordion';
import AccordionPill from '@/components/Badges/AccordionPill';
import BadgeStack from '@/components/Badges/BadgeStack';
import Hero from '@/components/Badges/Hero';
import { Level } from '@/components/Cards/Level';
import { Rank } from '@/components/Cards/Rank';
import { TreasureChest } from '@/components/Cards/TreasureChest';
import Circle from '@/components/Circle';
import Text from '@/components/Text';
import BadgeContainer from '@/components/assets/BadgeContainer';
import { GAME_ID } from '@/constants/gameId';
import { useDrawer } from '@/context/DrawerContext';
import { BadgeTypeEnum } from '@/hooks/types';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useClientCheck } from '@/hooks/useClientCheck';
import { useGameState } from '@/hooks/useGameState';
import { useRank } from '@/hooks/useRank';
import { useScore } from '@/hooks/useScore';
import { useTreasureBox } from '@/hooks/useTreasureBox';
import { useUserName } from '@/hooks/useUsername';
import { Box, Drawer, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function Badges() {
  const isClient = useClientCheck();
  const router = useRouter();
  const { address, isConnected, isDisconnected } = useAccount();
  const { drawerStates, toggleDrawer } = useDrawer();
  const { data: userPublicProfile } = useCBProfile({ address });
  const userName = useUserName({ address, userPublicProfile });
  const { disconnectAsync } = useDisconnect();
  const [irlAccordionExpanded, setIrlAccordionExpanded] = useState(false);
  const [virtualAccordionExpanded, setVirtualAccordionExpanded] =
    useState(false);
  const {
    data: badges,
    isLoading,
    error,
  } = useGameState({ userAddress: address, gameId: GAME_ID });
  const { data: score, isLoading: isScoreLoading } = useScore({
    userAddress: address ?? '',
    gameId: GAME_ID,
  });
  const { data: treasureBox, isLoading: isTreasureBoxLoading } = useTreasureBox(
    {
      gameId: GAME_ID,
    }
  );

  const { data: rank, isLoading: isRankLoading } = useRank({
    userAddress: address ?? '',
    gameId: GAME_ID,
  });

  const handleDisconnect = useCallback(async () => {
    await disconnectAsync();
    router.push('/');
  }, [disconnectAsync]);

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
    [toggleDrawer]
  );

  const handleToggleAccordion = useCallback((type: BadgeTypeEnum) => {
    if (type === BadgeTypeEnum.IRL) {
      setIrlAccordionExpanded((prev) => !prev);
    } else if (type === BadgeTypeEnum.Online) {
      setVirtualAccordionExpanded((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    if (isDisconnected) {
      router.push('/');
    }
  }, [isDisconnected]);

  const BadgesWrapper = useMemo(() => {
    if (isClient) {
      return (
        <>
          {error && <div>Error...</div>}
          {badges && (
            <>
              <Box
                sx={{
                  paddingTop: '30px',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
                gap={2}
              >
                {badges && (
                  <>
                    <CustomAccordion
                      title="Art Basel Exclusive"
                      toggleFunction={handleToggleAccordion}
                      expanded={irlAccordionExpanded}
                      panel={BadgeTypeEnum.IRL}
                      pill={
                        <AccordionPill
                          totalCount={badges.irlBadges.length}
                          collectedCount={badges.completedIRLBadgeCount}
                        />
                      }
                    >
                      <BadgeContainer badges={badges.irlBadges} />
                    </CustomAccordion>
                    <BadgeStack
                      toggleFunction={handleToggleAccordion}
                      panel={BadgeTypeEnum.IRL}
                      hide={irlAccordionExpanded}
                    />
                  </>
                )}
              </Box>
              <Box
                sx={{
                  paddingTop: '30px',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
                gap={2}
              >
                {badges && (
                  <>
                    <CustomAccordion
                      title="Global Collection"
                      toggleFunction={handleToggleAccordion}
                      expanded={virtualAccordionExpanded}
                      panel={BadgeTypeEnum.Online}
                      pill={
                        <AccordionPill
                          totalCount={badges.onlineBadges.length}
                          collectedCount={badges.completedOnlineBadgeCount}
                        />
                      }
                    >
                      <BadgeContainer badges={badges.onlineBadges} />
                    </CustomAccordion>
                    <BadgeStack
                      toggleFunction={handleToggleAccordion}
                      panel={BadgeTypeEnum.Online}
                      hide={virtualAccordionExpanded}
                    />
                  </>
                )}
              </Box>
            </>
          )}
        </>
      );
    }
  }, [
    isClient,
    badges,
    error,
    irlAccordionExpanded,
    virtualAccordionExpanded,
    handleToggleAccordion,
  ]);

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
            <Text
              fontSize="1rem"
              sx={{
                color: 'white',
              }}
            >
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
    <>
      <Stack
        paddingX="1.25rem"
        gap="12px"
        paddingBottom="6rem"
        className="pageContent"
      >
        <Hero />
        <TreasureChest
          isOpen={treasureBox?.isOpen}
          ctaUrl={treasureBox?.ctaUrl}
        />
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="flex-start"
          gap="10px"
          alignSelf="stretch"
        >
          <Level
            currentLevel={score?.currentLevel}
            isLoading={isScoreLoading}
          />
          <Rank currentRank={rank?.rank} isLoading={isRankLoading} />
        </Stack>
        {BadgesWrapper}
        <Box>
          {(['bottom'] as const).map((anchor) => (
            <Fragment key={anchor}>
              <Drawer
                anchor={anchor}
                open={drawerStates.walletOperations[anchor]}
                onClose={() => handleToggleDrawer(anchor)}
                PaperProps={{
                  style: {
                    width: '390px',
                    left: 'calc(50% - 195px)', // 50% - half of width
                  },
                }}
              >
                {list(anchor)}
              </Drawer>
            </Fragment>
          ))}
        </Box>
      </Stack>
    </>
  );
}
