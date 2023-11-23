import { useAccount } from 'wagmi';
import { Stack } from '@mui/material';
import { memo, useCallback, useMemo } from 'react';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useDrawer } from '@/context/DrawerContext';
import { useScore } from '@/hooks/useScore';
import { useUserName } from '@/hooks/useUsername';
import Text from '@/components/Text';
import Circle from '@/components/Circle';
import { PointsPill } from '@/components/Pill';
import { UNIT } from '@/constants/unit';

const Navbar = () => {
  const { address, isDisconnected, isConnecting } = useAccount();
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';
  const { data: userPublicProfile, isLoading: isProfileLoading } = useCBProfile(
    { address }
  );
  const userName = useUserName({ address, userPublicProfile });
  const { toggleDrawer } = useDrawer();

  // Todo: solidify types and figure out why this is returning undefined
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

  const content = useMemo(() => {
    return (
      <>
        <Stack direction="row" gap=".5rem" alignItems={'center'} width="100%">
          <Stack
            onClick={handleDrawerToggle}
            direction="row"
            alignItems="center"
            spacing=".25rem"
            useFlexGap
            sx={{
              borderRadius: '6.25rem',
              padding: '0.25rem 0.5rem 0.25rem 0.5rem',
              backgroundColor: 'white',
            }}
          >
            {isDisconnected ? (
              <Text>Not connected</Text>
            ) : (
              <>
                <Circle color="yellow" size="1rem" />
                {userName && userName}
              </>
            )}
          </Stack>
        </Stack>
        <PointsPill
          backgroundColor="var(--CB-Blue, #0052FF)"
          points={score as number}
          unit={UNIT}
        />
      </>
    );
  }, [handleDrawerToggle, isDisconnected, score, userName]);

  return (
    <Stack direction="row" spacing={2} alignItems={'center'} width="100%">
      {content}
    </Stack>
  );
};

export default memo(Navbar);
