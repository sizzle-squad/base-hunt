'use client';

import CustomAccordion from '@/components/Badges/Accordion';
import Hero from '@/components/Badges/Hero';
import BadgeContainer from '@/components/assets/BadgeContainer';
import { useDrawer } from '@/context/DrawerContext';
import { useBadges } from '@/hooks/useBadges';
import { useClientCheck } from '@/hooks/useClientCheck';
import { Box, Button, Drawer, Stack, Typography } from '@mui/material';
import { Fragment, useCallback } from 'react';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export default function Badges() {
  const isClient = useClientCheck();
  const { address, isConnected } = useAccount();
  const { useGetBadges } = useBadges({ address, isConnected });
  const { drawerStates, toggleDrawer } = useDrawer();

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
                  <CustomAccordion title={'IRL Badges'}>
                    <BadgeContainer badges={badges.data.irlBadges} />
                  </CustomAccordion>
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
                  <CustomAccordion title={'Virtual Badges'}>
                    <BadgeContainer badges={badges.data.onlineBadges} />
                  </CustomAccordion>
                )}
              </Box>
            </>
          )}
        </>
      );
    }
  }, [isClient, badges, isLoading, error]);

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
