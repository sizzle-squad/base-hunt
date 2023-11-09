'use client';
import { WagmiConfig, createConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import { base } from 'viem/chains';
import { Jumbotron } from '@/components/assets/Jumbotron';
import { Box, Stack } from '@mui/material';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      paddingY="24px"
      paddingX="20px"
      direction="column"
      overflow={'hidden'}
      position={'relative'}
    >
      {children}
      <Footer />
    </Stack>
  );
}
