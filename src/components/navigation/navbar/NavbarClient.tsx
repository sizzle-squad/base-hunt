'use client';

import { useDrawer } from '@/context/DrawerContext';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useScore } from '@/hooks/useScore';
import { useUserName } from '@/hooks/useUsername';
import { Box, Skeleton, Stack } from '@mui/material';
import { useMemo, useCallback } from 'react';
import { useAccount } from 'wagmi';
import Text from '@/components/Text';
import Circle from '@/components/Circle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export const NavbarClient = () => {
  const { address, isDisconnected, isConnecting } = useAccount();
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';
  const { data: userPublicProfile, isLoading: isProfileLoading } = useCBProfile(
    { address }
  );
  const userName = useUserName({ address, userPublicProfile });
  const { toggleDrawer, drawerStates } = useDrawer();

  // TODO: solidify types and figure out why this is returning undefined
  const { data, isLoading: isScoreLoading } = useScore({
    userAddress: address ?? '',
    gameId,
  });

  const score = useMemo(() => {
    if (data && data.score?.currentScore) {
      return data.score.currentScore;
    }

    return 0;
  }, [data]);

  const handleDrawerToggle = useCallback(() => {
    toggleDrawer('walletOperations', 'bottom', true);
  }, [toggleDrawer]);

  const isLoading = useMemo(() => {
    return isProfileLoading || isScoreLoading || isConnecting;
  }, [isConnecting, isProfileLoading, isScoreLoading]);

  return (
    <Stack
      direction="row"
      width="100%"
      justifyItems="center"
      justifyContent="center"
    >
      <Stack
        data-testid="pill"
        onClick={handleDrawerToggle}
        direction="row"
        alignItems="center"
        spacing=".25rem"
        useFlexGap
        sx={{
          borderRadius: '6.25rem',
          padding: '0.25rem 0.5rem',
          backgroundColor: 'white',
          cursor: 'pointer',
        }}
      >
        {isDisconnected ? (
          <Text>Not connected</Text>
        ) : (
          <>
            <Circle color="yellow" size="1rem" />
            {userName && !isLoading && userName}
            {isLoading && <Skeleton width={80} height={20} />}
            {drawerStates.walletOperations.bottom ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};
