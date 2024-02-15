import { Skeleton, Stack } from '@mui/material';

import Text from '@/components/Text';

type Props = {
  points: number | string;
  unit?: 'pts' | 'points';
  backgroundColor?: string;
  textColor?: string;
  isLoading?: boolean;
};

export const PointsPill = ({
  points,
  unit,
  backgroundColor = '#fff',
  textColor = 'white',
  isLoading = false,
}: Props) => (
  <Stack
    width="fit-content"
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
      fontFamily: 'Coinbase Mono, -apple-system, Roboto, Helvetica, sans-serif',
      fontSize: '14px',
      lineHeight: '17px',
      fontWeight: 400,
    }}
  >
    <Text sx={{ color: textColor }} align="center">
      {!isLoading && points}
      {isLoading && <Skeleton variant="text" width={30} />}
    </Text>
    <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
      <Text sx={{ color: textColor }} align="center">
        {!isLoading && unit && unit}{' '}
        {isLoading && <Skeleton variant="text" width={30} />}
      </Text>
    </Stack>
  </Stack>
);
