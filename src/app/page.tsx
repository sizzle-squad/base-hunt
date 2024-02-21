'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Button, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

import { ConnectButton } from '@/components/assets/ConnectButton';
import { HomePageSVGRow } from '@/components/assets/icons/HomePageSVGRow';
import BaseHuntAnimated from '@/components/Badges/AnimatedHero';
import Text from '@/components/Text';
import { useMutateOptIn } from '@/hooks/useMutateOptIn';
import { GAME_ID } from '@/constants/gameId';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { optIn } = useMutateOptIn();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { isConnected } = useAccount({
    onConnect({ address }) {
      optIn.mutate({ gameId: GAME_ID, userAddress: address });
    },
  });
  const router = useRouter();

  const handleStartExploring = useCallback(() => {
    return router.push('/challenges');
  }, [router]);

  const ctaButton = useMemo(() => {
    const ctaText =
      process.env.NEXT_PUBLIC_KILL_SWITCH === 'true'
        ? 'Access Granted. Please Enter'
        : 'Start Playing';
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
          </Stack>
        </Stack>
        <Text fontSize="1.2rem" textAlign="center">
          Play onchain and unlock prizes.
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
