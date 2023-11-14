'use client';

import { useClientCheck } from '@/hooks/useClientCheck';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout';
import { useCallback, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';

// hydration issue without dynamic import
const Navbar = dynamic(() => import('@/components/navigation/navbar'), {
  ssr: false,
});

export default function TreasureBox() {
  const isClient = useClientCheck();

  const handleCTAPress = useCallback(() => {}, []);

  const content = useMemo(() => {
    return (
      <Stack
        direction="column"
        sx={{ width: '100%' }}
        alignItems="center"
        gap={2}
      >
        <Typography variant="h1">Treasure Box</Typography>M
      </Stack>
    );
  }, []);

  if (!isClient) return null;

  return (
    <Layout>
      <Navbar />
      {content}
    </Layout>
  );
}
