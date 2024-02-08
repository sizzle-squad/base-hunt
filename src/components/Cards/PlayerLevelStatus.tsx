'use client';

import { Stack, Card } from '@mui/material';
import { NextLevelProgressBar } from '../assets/NextLevelProgressBar';

export function PlayerLevelStatus() {
  return (
    <Card
      sx={{
        p: '20px',
        borderRadius: '12px',
        bgcolor: 'black',
        overflow: 'visible',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        gap="16px"
      >
        <NextLevelProgressBar />
      </Stack>
    </Card>
  );
}
