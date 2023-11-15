import { useAccount } from 'wagmi';
import { Box, Stack } from '@mui/material';
import { Color } from '@/constants/color';
import { memo, useMemo } from 'react';
import { getTruncatedAddress } from '@/utils/truncate';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useDrawer } from '@/context/DrawerContext';
import { useScore } from '@/hooks/useScore';

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

const StatusIndicatorDot = ({ color }: { color: Color | string }) => (
  <Box
    sx={{
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: color,
      padding: '0.25rem 0.5rem 0.25rem 0.25rem',
    }}
  />
);

const Navbar = () => {
  const { address, isDisconnected } = useAccount();
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';
  const { data: userPublicProfile } = useCBProfile({ address });
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

  const userAddress = useMemo(() => {
    if (userPublicProfile) {
      if (userPublicProfile.subdomainProfile) {
        return userPublicProfile.subdomainProfile.name;
      } else if (userPublicProfile.ensDomainProfile) {
        return userPublicProfile.ensDomainProfile.name;
      }
    }

    return address && getTruncatedAddress(address);
  }, [address, userPublicProfile]);

  if (isDisconnected) return null;

  return (
    <Stack
      paddingX="1rem"
      direction="row"
      spacing={2}
      alignItems={'center'}
      top="2rem"
      position="absolute"
      width="100%"
    >
      <Stack direction="row" gap=".5rem" alignItems={'center'} width="100%">
        <Stack
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
          <StatusIndicatorDot color="yellow" />
          {userAddress}
        </Stack>
        <Box onClick={() => toggleDrawer('walletOperations', 'bottom', true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
          >
            <path d="M3 6.5L8 10.5L13 6.5" stroke="white" stroke-width="2" />
          </svg>
        </Box>
      </Stack>
      {/* todo: solidify types */}
      <PointsPill points={score as number} />
    </Stack>
  );
};

export default memo(Navbar);
