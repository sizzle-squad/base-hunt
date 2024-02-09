import type { Metadata } from 'next';

import clsx from 'clsx';
import '@/globals.css';
import { Stack } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';

import Providers from '@/providers/providers';

import {
  coinbaseDisplay,
  coinbaseMono,
  coinbaseSans,
  coinbaseText,
  inter,
} from './font';

export const metadata: Metadata = {
  title: 'Base Hunt',
  description: 'Base hunt game on Base network at Art Basel Miami 2023',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={clsx(
            coinbaseSans.variable,
            coinbaseText.variable,
            coinbaseMono.variable,
            coinbaseDisplay.variable,
            inter.variable
          )}
        >
          <Stack flexDirection="row" justifyContent="center">
            {children}
          </Stack>
          <Analytics />
        </body>
      </Providers>
    </html>
  );
}
