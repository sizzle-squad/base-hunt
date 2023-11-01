import { QueryClient, QueryClientProvider } from 'react-query';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { base } from 'viem/chains';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/open-sans';

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

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ThemeProvider theme={theme}>
          <ConnectKitProvider mode="dark">
            <Component {...pageProps} />
          </ConnectKitProvider>
        </ThemeProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
