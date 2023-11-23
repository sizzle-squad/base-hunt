import { Box } from '@mui/material';
import Text from '@/components/Text';

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
  <Box
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
    <Text>
      {points} {unit}
    </Text>
  </Box>
);
