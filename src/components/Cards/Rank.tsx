import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import Text from '../Text';

const textStyle = {
  color: 'var(--Black, #1d1818)',
  margin: 'auto 0',
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily:
    "'Coinbase Display', 'Apple System', 'Roboto', 'Helvetica', sans-serif",
  fontSize: 16,
  lineHeight: '19px',
  fontWeight: 400,
};

type Props = {
  currentRank?: string | null;
  isLoading?: boolean;
};

export function Rank({ currentRank, isLoading }: Props) {
  const position = useMemo(() => {
    return currentRank ? `#${currentRank}` : 'N/A';
  }, [currentRank]);

  const content = useMemo(() => {
    if (isLoading) {
      return <Skeleton variant="text" width={100} height={20} />;
    }

    return (
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          margin: '0 auto',
          justifyContent: 'space-between',
        }}
        gap={3}
      >
        <Text variant="body1" sx={textStyle}>
          Rank
        </Text>
        <Text variant="body1" sx={textStyle} align="center">
          {position}
        </Text>
      </Stack>
    );
  }, [isLoading, position]);

  return (
    <Stack
      justifyContent="space-between"
      borderRadius="8px"
      bgcolor="var(--White, #fff)"
      display="flex"
      spacing={2}
      padding="12px 12px 12px 16px"
      sx={{ width: '100%' }}
      flex={1}
    >
      {content}
    </Stack>
  );
}