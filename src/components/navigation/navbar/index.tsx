import { useAccount, useEnsName } from 'wagmi';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Color } from '@/constants/color';
import { useMemo } from 'react';
import { ConnectButton } from '@/components/assets/ConnectButton';
import { getTruncatedAddress } from '@/utils/truncate';
import { useGetPublicProfile } from '@/hooks/useGetPublicProfile';

export default function Navbar() {
  const { address, isDisconnected } = useAccount();
  const { data: userPublicProfile } = useGetPublicProfile({ address });

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
    <Box
      sx={{
        width: '100%',
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="body1" color={Color.ForegroundMuted}>
            {userAddress}
          </Typography>
          <ConnectButton variant="text" fontSize="16px" px={1} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
