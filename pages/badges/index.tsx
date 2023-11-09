import { BadgeContainer } from '@/components/assets/BadgeContainer';
import Layout from '@/components/layout';
import Navbar from '@/components/navigation/navbar';
import { useGetBadges } from '@/hooks/useGetBadges';
import { Stack, Typography } from '@mui/material';
import { useAccount } from 'wagmi';

export default function Badges() {
  const { address, isConnected } = useAccount();
  const { data: badges } = useGetBadges({ address, isConnected });

  return (
    <Layout>
      <Navbar />
      <Stack
        sx={{ paddingTop: '30px', alignItems: 'flex-start', width: '100%' }}
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
        sx={{ paddingTop: '30px', alignItems: 'flex-start', width: '100%' }}
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
    </Layout>
  );
}
