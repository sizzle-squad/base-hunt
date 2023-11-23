import { ReactNode } from 'react';
import { Card as MuiCard, Stack } from '@mui/material';

type Props = {
  children: ReactNode;
};

export function Card({ children }: Props) {
  return (
    <MuiCard
      sx={{
        p: '20px',
        borderRadius: '12px',
        bgcolor: 'white',
        overflow: 'visible',
        width: '335px',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        gap="16px"
      >
        {children}
      </Stack>
    </MuiCard>
  );
}
