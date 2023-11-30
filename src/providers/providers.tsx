'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { base } from 'viem/chains';
import { WagmiConfig, createConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/open-sans';
import '@/globals.css';
import { CssBaseline } from '@mui/material';
import { MobileProvider } from '@/context/MobileContext';
import { DesiredNetworkContextProvider } from '@/context/DesiredNetworkContext';

type Props = {
  children: React.ReactNode;
};

const alchemyId = process.env.ALCHEMY_ID;

const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID!;

const chains = [base];

const config = createConfig(
  getDefaultConfig({
    appName: 'Base Hunt',
    alchemyId,
    walletConnectProjectId,
    chains,
  })
);

const theme = createTheme({
  typography: {
    fontFamily: `CoinbaseSans, Open Sans, sans-serif`,
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

const Providers = ({ children }: Props) => {
  const queryClient = new QueryClient();
  return (
    <MobileProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>
          <DesiredNetworkContextProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ConnectKitProvider mode="dark">{children}</ConnectKitProvider>
            </ThemeProvider>
          </DesiredNetworkContextProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </MobileProvider>
  );
};

export default Providers;
