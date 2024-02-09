'use client';
import { ReactNode } from 'react';

import { Stack } from '@mui/material';

type Props = {
  noPadding?: boolean;
  children: ReactNode;
};

export default function RootLayout({ noPadding = false, children }: Props) {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      direction="column"
      overflow={'hidden'}
      position={'relative'}
      width="100%"
    >
      {children}
    </Stack>
  );
}
