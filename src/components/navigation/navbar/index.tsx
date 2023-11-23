import { useAccount } from 'wagmi';
import { Box, Stack } from '@mui/material';
import { Color } from '@/constants/color';
import { memo, useCallback, useMemo } from 'react';
import { getTruncatedAddress } from '@/utils/truncate';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useDrawer } from '@/context/DrawerContext';
import { useScore } from '@/hooks/useScore';
import { useUserName } from '@/hooks/useUsername';
import Text from '@/components/Text';
import Circle from '@/components/Circle';
import { PointsPill } from '@/components/Pill';

const Navbar = () => {
  const { address, isDisconnected } = useAccount();
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';
  const { data: userPublicProfile } = useCBProfile({ address });
  const userName = useUserName({ address, userPublicProfile });
  const { toggleDrawer } = useDrawer();

  // Todo: solidify types and figure out why this is returning undefined
  const { data } = useScore({
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

  if (isDisconnected) return null;

  return (
    <Stack direction="row" spacing={2} alignItems={'center'} width="100%">
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
      {/* todo: solidify types */}
      <PointsPill
        backgroundColor="#e1ff67"
        points={score as number}
        unit="points"
      />
    </Stack>
  );
};

export default memo(Navbar);
