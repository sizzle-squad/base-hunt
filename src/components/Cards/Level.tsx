import { Level } from '@/hooks/types';
import { Box, Skeleton, Typography } from '@mui/material';
import { useMemo } from 'react';

type Props = {
  currentLevel?: Level | null;
  isLoading?: boolean;
};

export function Level({ currentLevel, isLoading }: Props) {
  const content = useMemo(() => {
    if (isLoading || !currentLevel) {
      return <Skeleton variant="text" width={100} height={20} />;
    }

    return (
      <Typography
        variant="body1"
        sx={{
          color: 'var(--Black, #1d1818)',
          margin: 'auto 0',
          fontFeatureSettings: "'clig' off, 'liga' off",
          fontFamily:
            "'Coinbase Display', 'Apple System', 'Roboto', 'Helvetica', sans-serif",
          fontSize: 16,
          lineHeight: '19px',
          fontWeight: 400,
        }}
      >
        Level {currentLevel.level}
      </Typography>
    );
  }, [currentLevel, isLoading]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: 'var(--White, #fff)',
        padding: '12px 16px',
        justifyContent: 'space-between',
        gap: 20,
        height: '44px',
        width: '100%',
      }}
    >
      {content}
    </Box>
  );
}
