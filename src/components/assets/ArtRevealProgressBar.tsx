import { Box, LinearProgress } from '@mui/material';

type Props = {
  progress: number;
};

export function ArtRevealProgressBar({ progress }: Props) {
  const value = progress < 5 ? 5 : progress;
  return (
    <Box
      sx={{
        borderRadius: '6.25rem',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}
    >
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          borderRadius: '6.25rem',
          height: '10px',
          backgroundColor: '#D5D5D5', // To make the unused part of the progress bar transparent
          '& .MuiLinearProgress-bar': {
            backgroundColor: 'var(--CB-Blue, #0052FF)', // Color for the progress indicator
          },
        }}
      />
    </Box>
  );
}
