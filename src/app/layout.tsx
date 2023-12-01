import type { Metadata } from 'next';
import {
  coinbaseSans,
  coinbaseText,
  coinbaseMono,
  coinbaseDisplay,
  inter,
} from './font';
import clsx from 'clsx';
import '@/globals.css';
import Providers from '@/providers/providers';
import { Box, Stack } from '@mui/material';

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
        </body>
      </Providers>
    </html>
  );
}
