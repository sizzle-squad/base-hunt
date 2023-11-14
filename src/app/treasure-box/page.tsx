'use client';

import { useClientCheck } from '@/hooks/useClientCheck';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout';
import { useCallback, useMemo } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useMutateTreasureBox } from '@/hooks/useMutateTreasureBox';
import { GAME_ID } from '@/constants/gameId';
import { useAccount } from 'wagmi';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useTreasureBox } from '@/hooks/useTreasureBox';

// hydration issue without dynamic import
const Navbar = dynamic(() => import('@/components/navigation/navbar'), {
  ssr: false,
});

export default function TreasureBox() {
  const isClient = useClientCheck();
  const { address } = useAccount();
  const { data: userPublicProfile } = useCBProfile({ address });
  const { attackBox } = useMutateTreasureBox();
  const { data: treasureBox } = useTreasureBox({ gameId: GAME_ID });

  const handleCTAPress = useCallback(() => {
    attackBox.mutate({
      gameId: GAME_ID,
      user: {
        address: address!,
        cbId: userPublicProfile?.subdomainProfile.name,
        ensName: userPublicProfile?.ensDomainProfile.name,
      },
    });
  }, []);

  const content = useMemo(() => {
    return (
      <Stack
        direction="column"
        sx={{ width: '100%' }}
        alignItems="center"
        gap={2}
      >
        <Typography variant="h3">Treasure Box</Typography>
        <Typography variant="body1">{`Remaining HP: ${treasureBox?.hitPoints}`}</Typography>
        <Button
          variant="contained"
          onClick={handleCTAPress}
          disabled={treasureBox?.isOpen}
        >
          Attack Box!
        </Button>
      </Stack>
    );
  }, []);

  if (!isClient || !treasureBox) return null;

  return (
    <Layout>
      <Navbar />
      {content}
    </Layout>
  );
}
