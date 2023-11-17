import { useAccount } from 'wagmi';
import { Box, Stack } from '@mui/material';
import { Color } from '@/constants/color';
import { memo, useMemo } from 'react';
import { getTruncatedAddress } from '@/utils/truncate';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useDrawer } from '@/context/DrawerContext';
import { useScore } from '@/hooks/useScore';
import { useUserName } from '@/hooks/useUsername';
import Text from '@/components/Text';
import Circle from '@/components/Circle';

const PointsPill = ({ points }: { points: number }) => (
  <Box
    sx={{
      color: '#151515', // Replaces var(--Black, #151515)
      fontFeatureSettings: '"clig" off, "liga" off',
      letterSpacing: '-0.5px',
      whiteSpace: 'nowrap', // Adjusts for responsiveness
      borderRadius: '6.25rem',
      backgroundColor: '#e1ff67', // Replaces var(--Hive-Green, #e1ff67)
      padding: '4px 8px',
      fontFamily: 'Coinbase Mono, -apple-system, Roboto, Helvetica, sans-serif',
      fontSize: '14px',
      lineHeight: '17px',
      fontWeight: 400,
    }}
  >
    {points} points
  </Box>
);

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

  if (isDisconnected) return null;

  return (
    <Stack direction="row" spacing={2} alignItems={'center'} width="100%">
      <Stack direction="row" gap=".5rem" alignItems={'center'} width="100%">
        <Stack
          onClick={() => toggleDrawer('walletOperations', 'bottom', true)}
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
      <PointsPill points={score as number} />
    </Stack>
  );
};

export default memo(Navbar);
