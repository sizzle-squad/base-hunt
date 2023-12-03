'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { base } from 'viem/chains';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/open-sans';
import '@/globals.css';
import { CssBaseline } from '@mui/material';
import { MobileProvider } from '@/context/MobileContext';
import { DesiredNetworkContextProvider } from '@/context/DesiredNetworkContext';

type Props = {
  children: React.ReactNode;
};

const alchemyId = process.env.ALCHEMY_ID!;

const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID!;

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
        <ThemeProvider theme={theme}>
          <WagmiConfig config={config}>
            <RainbowKitProvider chains={chains}>
              <DesiredNetworkContextProvider>
                <CssBaseline />
                {children}
              </DesiredNetworkContextProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        </ThemeProvider>
      </QueryClientProvider>
    </MobileProvider>
  );
};

export default Providers;
