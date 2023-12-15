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
import Text from '@/components/Text';
import { HomePageSVGRow } from '@/components/assets/icons/HomePageSVGRow';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

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
    const ctaText =
      process.env.NEXT_PUBLIC_KILL_SWITCH === 'true'
        ? 'Access Granted. Please Enter'
        : 'Start Exploring';
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
          {ctaText}
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
        direction="column"
        justifyContent={['space-between', 'unset']}
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
        gap="4rem"
      >
        <Stack width="100%" justifyContent="center" alignItems="center">
          <BaseHuntAnimated width="100%" />
          <Stack
            width="100%"
            justifyContent="center"
            alignItems="center"
            gap=".6rem"
          >
            <HomePageSVGRow />
            <Text textAlign="center" fontSize="1rem">
              See Art. Mint Art. Reveal Art.
            </Text>
          </Stack>
        </Stack>
        <Text fontSize="1.2rem" textAlign="center">
          Collect onchain art, unlock exclusive Base merch.
        </Text>
        <Stack alignItems="center">
          <Stack
            paddingTop={5}
            alignItems="center"
            width={['100%', '60%', '40%']}
          >
            {ctaButton}
          </Stack>
          <Stack alignItems="center">
            <RainbowConnectButton.Custom>
              {({ openConnectModal, mounted, account, chain }) => {
                return (
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
                      ':hover': {
                        cursor: 'pointer',
                      },
                    }}
                    onClick={openConnectModal}
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
                );
              }}
            </RainbowConnectButton.Custom>
            <Text align="center">
              Instant and free mints only with Coinbase Wallet
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
