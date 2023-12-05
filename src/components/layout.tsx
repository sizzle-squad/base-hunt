'use client';
import { Stack } from '@mui/material';
import { ReactNode } from 'react';
import { base } from 'viem/chains';
import { createConfig } from 'wagmi';

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
      width="100%"
    >
      {children}
    </Stack>
  );
}
