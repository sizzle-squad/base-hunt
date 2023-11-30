'use client';
import { Stack } from '@mui/material';
import { getDefaultConfig } from 'connectkit';
import { ReactNode } from 'react';
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

type Props = {
  noPadding?: boolean;
  children: ReactNode;
};

export default function RootLayout({ noPadding = false, children }: Props) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      paddingY={noPadding ? '0' : '24px'}
      paddingX={noPadding ? '0' : '20px'}
      direction="column"
      overflow={'hidden'}
      position={'relative'}
    >
      {children}
    </Stack>
  );
}
