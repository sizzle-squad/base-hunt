'use client';

import Layout from '@/components/layout';
import { Jumbotron } from '@/components/assets/Jumbotron';
import Head from 'next/head';
import { Box, Button, Icon, Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Color } from '@/constants/color';
import { ConnectButton } from '@/components/assets/ConnectButton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleStartExploring = useCallback(() => {
    return router.push('/badges');
  }, []);

  const ctaButton = useMemo(() => {
    if (isClient) {
      return isConnected || true ? (
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

  return (
    <>
      <Head>
        <title>Base Hunt</title>
        <meta name="description" content="Base Hunt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack
        component="div"
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
        <Jumbotron />
        <Stack paddingTop={5} alignItems="center" width="100%">
          {ctaButton}
        </Stack>
        <Stack alignItems="center">
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              py: 1,
              px: 2,
              mt: 4,
              mb: 2,
              borderRadius: 20,
              bgcolor: 'white',
              gap: 1,
            }}
          >
            <Image
              src="/images/coinbase-wallet-logo.png"
              alt="Coinbase Wallet Logo"
              height={24}
              width={24}
            />
            <Typography fontSize={14}>
              Coinbase Wallet{' '}
              <Box component="span" fontWeight="bold">
                Recommended
              </Box>
            </Typography>
          </Stack>
          <Link href="/" variant="body1" color="black" underline="none">
            Download now
          </Link>
        </Stack>
      </Stack>
    </>
  );
}
