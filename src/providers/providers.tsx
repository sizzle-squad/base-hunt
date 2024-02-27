'use client';

import React from 'react';

import '@rainbow-me/rainbowkit/styles.css';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DisclaimerComponent,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from 'react-query';
import { base } from 'viem/chains';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '@fontsource/open-sans';
import '@/globals.css';

import { DesiredNetworkContextProvider } from '@/context/DesiredNetworkContext';
import { GameInfoProvider } from '@/context/GameInfoContext';
import { MobileProvider } from '@/context/MobileContext';

type Props = {
  children: React.ReactNode;
};

const alchemyId = process.env.ALCHEMY_ID!;
const { chains, publicClient } = configureChains(
  [base],
  [alchemyProvider({ apiKey: alchemyId }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Base Hunt',
  projectId: 'base-hunt',
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const theme = createTheme({
  typography: {
    fontFamily: `CoinbaseSans, Open Sans, sans-serif`,
    h6: {
      fontSize: '14px',
    },
    body2: {
      fontSize: '12px',
    },
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    background: {
      default: '#D9D9D9',
    },
  },
});

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you are agreeing to our{' '}
    <Link href="https://basehunt.splashthat.com/">Terms of Service</Link>.
  </Text>
);

const Providers = ({ children }: Props) => {
  const queryClient = new QueryClient();
  return (
    <MobileProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <WagmiConfig config={config}>
            <RainbowKitProvider
              chains={chains}
              appInfo={{ disclaimer: Disclaimer }}
            >
              <DesiredNetworkContextProvider>
                <GameInfoProvider>
                  <CssBaseline />
                  {children}
                </GameInfoProvider>
              </DesiredNetworkContextProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </ThemeProvider>
      </QueryClientProvider>
    </MobileProvider>
  );
};

export default Providers;
