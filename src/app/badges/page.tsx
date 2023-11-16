'use client';

import CustomAccordion from '@/components/Badges/Accordion';
import BadgeStack from '@/components/Badges/BadgeStack';
import Hero from '@/components/Badges/Hero';
import BadgeContainer from '@/components/assets/BadgeContainer';
import { useDrawer } from '@/context/DrawerContext';
import { useClientCheck } from '@/hooks/useClientCheck';
import { useGameState } from '@/hooks/useGameState';
import { Box, Drawer, Typography } from '@mui/material';
import { Fragment, useCallback, useState } from 'react';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { GAME_ID } from '@/constants/gameId';
import { BadgeTypeEnum } from '@/hooks/types';
import AccordionPill from '@/components/Badges/AccordionPill';

export default function Badges() {
  const isClient = useClientCheck();
  const { address } = useAccount();
  const { drawerStates, toggleDrawer } = useDrawer();
  const [irlAccordionExpanded, setIrlAccordionExpanded] = useState(false);
  const [virtualAccordionExpanded, setVirtualAccordionExpanded] =
    useState(false);

  const toggleAccordion = useCallback((type: BadgeTypeEnum) => {
    if (type === BadgeTypeEnum.IRL) {
      setIrlAccordionExpanded((prev) => !prev);
    } else if (type === BadgeTypeEnum.Online) {
      setVirtualAccordionExpanded((prev) => !prev);
    }
  }, []);

  const {
    data: badges,
    isLoading,
    error,
  } = useGameState({ userAddress: address, gameId: GAME_ID });

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
                      toggleFunction={toggleAccordion}
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
                      toggleFunction={toggleAccordion}
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
                      toggleFunction={toggleAccordion}
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
                      toggleFunction={toggleAccordion}
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
    toggleAccordion,
  ]);

  type Anchor = 'top' | 'left' | 'bottom' | 'right';

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      {/* Add the content you want in the drawer here */}
      <Typography variant="h6" sx={{ p: 2 }}>
        Drawer Content Wallet
      </Typography>
    </Box>
  );

  const handleToggleDrawer = useCallback(
    (anchor: Anchor) => {
      toggleDrawer(
        'walletOperations',
        anchor,
        drawerStates.walletOperations[anchor]
      );
    },
    [drawerStates.walletOperations, toggleDrawer]
  );

  return (
    <Box>
      <Hero />
      <Box>{BadgesWrapper}</Box>
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
  );
}
