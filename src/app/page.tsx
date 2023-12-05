'use client';

import Head from 'next/head';
import { Box, Button, Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ConnectButton } from '@/components/assets/ConnectButton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BaseHuntAnimated from '@/components/Badges/AnimatedHero';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleStartExploring = useCallback(() => {
    return router.push('/badges');
  }, [router]);

  const ctaButton = useMemo(() => {
    if (isClient) {
      return isConnected ? (
        <Button
          variant="contained"
          color="primary"
          sx={{
            py: '20px',
            px: 3,
            fontSize: '16px',
            backgroundColor: '#000000',
            width: '100%',
            borderRadius: '12px',
            fontFamily: 'CoinbaseMono',
            fontWeight: 400,
          }}
          onClick={handleStartExploring}
        >
          Start Exploring
        </Button>
      ) : (
        <ConnectButton />
      );
    }
  }, [isConnected, handleStartExploring, isClient]);

  useEffect(() => {
    if (isClient && isConnected) {
      router.push('/badges');
    }
  }, [isClient, isConnected, router]);

  return (
    <>
      <Head>
        <title>Base Hunt</title>
        <meta name="description" content="Base Hunt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{
          position: 'absolute',
          px: '20px',
          py: '35px',
          width: '100vw',
          height: '100vh',
          backgroundImage: `url('/images/landing-bg.svg')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Stack width="100%" justifyContent="center" marginTop="5rem">
          <BaseHuntAnimated width="20rem" height="" />
        </Stack>
      </Stack>
    </>
  );
}
