import { ReactNode } from 'react';

import { Stack } from '@mui/material';

export default function Pill({
  backgroundColor = '#efefef',
  textColor = 'var(--Black, #151515)',
  hover,
  children,
  onClick,
}: {
  backgroundColor?: string;
  hover?: boolean;
  children: ReactNode;
  onClick?: () => void;
  textColor?: string;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={1}
      onClick={onClick}
      sx={{
        color: textColor,
        fontFeatureSettings: '"clig" off, "liga" off',
        letterSpacing: '-0.5px',
        whiteSpace: 'nowrap', // Adjusts for responsiveness
        borderRadius: '6.25rem',
        backgroundColor, // Replaces var(--Hive-Green, #e1ff67)
        padding: '4px 10px',
        fontFamily:
          'Coinbase Mono, -apple-system, Roboto, Helvetica, sans-serif',
        fontSize: '14px',
        lineHeight: '17px',
        fontWeight: 400,
        ':hover': {
          cursor: hover ? 'pointer' : 'default',
        },
      }}
    >
      {children}
    </Stack>
  );
}
