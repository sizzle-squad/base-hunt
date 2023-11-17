'use client';

import CustomAccordion from '@/components/Badges/Accordion';
import AccordionPill from '@/components/Badges/AccordionPill';
import BadgeStack from '@/components/Badges/BadgeStack';
import Hero from '@/components/Badges/Hero';
import BadgeContainer from '@/components/assets/BadgeContainer';
import { ConnectedDrawer } from '@/components/drawers/ConnectedDrawer';
import { RetryDrawer } from '@/components/drawers/RetryDrawer';
import { GAME_ID } from '@/constants/gameId';
import { Anchor, useDrawer } from '@/context/DrawerContext';
import { BadgeTypeEnum } from '@/hooks/types';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useClientCheck } from '@/hooks/useClientCheck';
import { useGameState } from '@/hooks/useGameState';
import { useUserName } from '@/hooks/useUsername';
import { Box, Drawer, Stack } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

const Footer = dynamic(() => import('@/components/navigation/footer'), {
  ssr: false,
});

export default function Badges() {
  const isClient = useClientCheck();
  const router = useRouter();
  const { address, isConnected, isReconnecting } = useAccount();
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

  const BadgesWrapper = useMemo(() => {
    if (isClient) {
      return (
        <>
          {isLoading && <div>Loading...</div>}
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
                      title={'IRL Badges'}
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
                      title={'Online Badges'}
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
    isLoading,
    error,
    irlAccordionExpanded,
    virtualAccordionExpanded,
    handleToggleAccordion,
  ]);

  const DrawerContent = useMemo(() => {
    if (isConnected) {
      return (
        <ConnectedDrawer
          anchor="bottom"
          dismissCallback={handleDrawerDismiss}
          disconnectCallback={handleDisconnect}
          isConnected={isConnected}
          address={address}
          userName={userName}
        />
      );
    } else if (!isConnected || !isReconnecting) {
      return <RetryDrawer />;
    }
  }, [isConnected, handleDrawerDismiss, handleDisconnect, address, userName]);

  return (
    <>
      <Box paddingX="1.25rem">
        <Hero />
        <Box>{BadgesWrapper}</Box>
        {(['bottom'] as const).map((anchor) => (
          <Fragment key={anchor}>
            <Drawer
              anchor={anchor}
              open={drawerStates.walletOperations[anchor]}
              onClose={() => handleToggleDrawer(anchor)}
            >
              {DrawerContent}
            </Drawer>
          </Fragment>
        ))}
      </Box>
      <Footer />
    </>
  );
}
