'use client';

import Hero from '@/components/Badges/Hero';
import BadgeContainer from '@/components/assets/BadgeContainer';
import { useDrawer } from '@/context/DrawerContext';
import { useBadges } from '@/hooks/useBadges';
import { useClientCheck } from '@/hooks/useClientCheck';
import { Box, Button, Drawer, Stack, Typography } from '@mui/material';
import React from 'react';
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
              <Stack
                sx={{
                  paddingTop: '30px',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
                gap={2}
              >
                <Typography
                  variant="h5"
                  textAlign="left"
                  fontWeight="fontWeightBold"
                  sx={{ fontSize: '22px' }}
                >
                  Art Basel (Miami)
                </Typography>
                {badges && badges.data && (
                  <BadgeContainer badges={badges.data.irlBadges} />
                )}
              </Stack>
              <Stack
                sx={{
                  paddingTop: '30px',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
                gap={2}
              >
                <Typography
                  variant="h5"
                  textAlign="left"
                  fontWeight="fontWeightBold"
                  sx={{ fontSize: '22px' }}
                >
                  Virtual
                </Typography>
                {badges && badges.data && (
                  <BadgeContainer badges={badges.data.onlineBadges} />
                )}
              </Stack>
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

  return (
    <Box>
      <Hero />
      <Box>{BadgesWrapper}</Box>
      {(['bottom'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            onClick={() => toggleDrawer('walletOperations', anchor, true)}
          >
            Wallet Operations {anchor}
          </Button>
          <Drawer
            anchor={anchor}
            open={drawerStates.walletOperations[anchor]}
            onClose={() => toggleDrawer('walletOperations', anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </Box>
  );
}
