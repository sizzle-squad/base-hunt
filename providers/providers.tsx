'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { base } from 'viem/chains';
import { WagmiConfig, createConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/open-sans';

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
    fontFamily: 'Open Sans',
  },
});

const Providers = ({ children }: Props) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ThemeProvider theme={theme}>
          <ConnectKitProvider mode="dark">{children}</ConnectKitProvider>
        </ThemeProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};

export default Providers;
