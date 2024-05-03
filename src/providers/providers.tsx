'use client';

import React from 'react';

import '@rainbow-me/rainbowkit/styles.css';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DisclaimerComponent,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import '@fontsource/open-sans';
import '@/globals.css';

import { DesiredNetworkContextProvider } from '@/context/DesiredNetworkContext';
import { GameInfoProvider } from '@/context/GameInfoContext';
import { MobileProvider } from '@/context/MobileContext';

type Props = {
  children: React.ReactNode;
};

// const alchemyId = process.env.ALCHEMY_ID!;
const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
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
      <ThemeProvider theme={theme}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider appInfo={{ disclaimer: Disclaimer }}>
              <DesiredNetworkContextProvider>
                <GameInfoProvider>
                  <CssBaseline />
                  {children}
                </GameInfoProvider>
              </DesiredNetworkContextProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </MobileProvider>
  );
};

export default Providers;
