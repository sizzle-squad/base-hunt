import { Stack } from '@mui/material';
import { ReactNode } from 'react';

export default function Pill({
  backgroundColor = '#efefef',
  children,
}: {
  backgroundColor?: string;
  children: ReactNode;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={1}
      sx={{
        color: '#151515', // Replaces var(--Black, #151515)
        fontFeatureSettings: '"clig" off, "liga" off',
        letterSpacing: '-0.5px',
        whiteSpace: 'nowrap', // Adjusts for responsiveness
        borderRadius: '6.25rem',
        backgroundColor, // Replaces var(--Hive-Green, #e1ff67)
        padding: '4px 8px',
        fontFamily:
          'Coinbase Mono, -apple-system, Roboto, Helvetica, sans-serif',
        fontSize: '14px',
        lineHeight: '17px',
        fontWeight: 400,
      }}
    >
      {children}
    </Stack>
  );
}
