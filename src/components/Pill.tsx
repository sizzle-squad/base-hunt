import { Box, Stack } from '@mui/material';
import Text from '@/components/Text';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type Props = {
  points: number;
  unit: 'pts' | 'points';
  backgroundColor?: string;
};

export const PointsPill = ({
  points,
  unit,
  backgroundColor = '#fff',
}: Props) => (
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
      fontFamily: 'Coinbase Mono, -apple-system, Roboto, Helvetica, sans-serif',
      fontSize: '14px',
      lineHeight: '17px',
      fontWeight: 400,
    }}
  >
    <Text sx={{ color: '#fff' }} align="center">
      {points}
    </Text>
    <Stack direction="row" alignItems="center" justifyContent="center" gap={1}>
      <Text sx={{ color: '#fff' }} align="center">
        {unit}{' '}
      </Text>
      <svg
        width="5"
        height="9"
        viewBox="0 0 5 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 8.5L4 4.5L1 0.5" stroke="white" stroke-width="1.5" />
      </svg>
    </Stack>
  </Stack>
);