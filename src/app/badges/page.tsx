'use client';

import CustomAccordion, { Panel } from '@/components/Badges/Accordion';
import BadgeStack from '@/components/Badges/BadgeStack';
import Hero from '@/components/Badges/Hero';
import BadgeContainer from '@/components/assets/BadgeContainer';
import { useDrawer } from '@/context/DrawerContext';
import { useBadges } from '@/hooks/useBadges';
import { useClientCheck } from '@/hooks/useClientCheck';
import { Box, Drawer, Typography } from '@mui/material';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export default function Badges() {
  const isClient = useClientCheck();
  const { address, isConnected } = useAccount();
  const { useGetBadges } = useBadges({ address, isConnected });
  const { drawerStates, toggleDrawer } = useDrawer();
  const [irlAccordionExpanded, setIrlAccordionExpanded] = useState(false);
  const [virtualAccordionExpanded, setVirtualAccordionExpanded] =
    useState(false);

  const toggleAccordion = useCallback((type: Panel) => {
    console.log('🚀 ~ file: page.tsx:25 ~ toggleAccordion ~ type:', type);
    if (type === 'irl') {
      setIrlAccordionExpanded((prev) => !prev);
    } else if (type === 'virtual') {
      setVirtualAccordionExpanded((prev) => !prev);
    }
  }, []);

  const { data: badges, isLoading, error } = useGetBadges();

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
                {badges && badges.data && (
                  <>
                    <CustomAccordion
                      title={'IRL Badges'}
                      toggleFunction={toggleAccordion}
                      expanded={irlAccordionExpanded}
                      panel="irl"
                    >
                      <BadgeContainer badges={badges.data.irlBadges} />
                    </CustomAccordion>
                    <BadgeStack
                      toggleFunction={toggleAccordion}
                      panel="irl"
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
                {badges && badges.data && (
                  <>
                    <CustomAccordion
                      title={'Virtual Badges'}
                      toggleFunction={toggleAccordion}
                      expanded={virtualAccordionExpanded}
                      panel="virtual"
                    >
                      <BadgeContainer badges={badges.data.onlineBadges} />
                    </CustomAccordion>
                    <BadgeStack
                      toggleFunction={toggleAccordion}
                      panel="virtual"
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
    [toggleDrawer]
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
