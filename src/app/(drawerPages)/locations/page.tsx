'use client';

import { Stack } from '@mui/material';
import Image from 'next/image';

import Layout from '@/components/layout';

export default function Map() {
  return (
    <Layout noPadding>
      <Stack
        sx={{
          height: '95vh',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--Black, #151515)',
        }}
      >
        <Image
          src="/images/map-updated.png"
          alt="Badge locations map"
          width="400"
          height={600}
          objectFit="cover"
        />
      </Stack>
    </Layout>
  );
}
