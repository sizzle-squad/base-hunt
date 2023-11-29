'use client';
import { Stack } from '@mui/material';
import { getDefaultConfig } from 'connectkit';
import { base } from 'viem/chains';
import { createConfig } from 'wagmi';

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
      marginBottom="80px"
    >
      {children}
    </Stack>
  );
}
