import BadgeDetailsTitleBar from '@/components/Badges/BadgeDetailsTitleBar';
import { Box, Skeleton, Stack } from '@mui/material';

export default function Loading() {
  // Skeleton for BadgeDetails.
  return (
    <Stack
      sx={{
        height: '100vh',
        widows: '100vw',
        background: 'var(--Gray, #E3E3E3);',
        alignItems: 'center',
      }}
    >
      <BadgeDetailsTitleBar owned={false} />

      <Box
        sx={{
          filter: 'grayscale(1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '32px',
          overflow: 'hidden',
          mt: '120px',
          boxShadow:
            '0px 4px 4px 0px rgba(0, 0, 0, 0.10), 0px 8px 12px 0px rgba(0, 0, 0, 0.10), 0px 24px 32px 0px rgba(0, 0, 0, 0.10)',
        }}
      >
        <Skeleton
          sx={{
            width: '256px',
            height: '256px',
            borderRadius: '12px',
          }}
          variant="rectangular"
        />
      </Box>

      <Stack
        sx={{
          py: 1,
          px: 2,
          mt: 6,
          gap: 1,
        }}
      >
        <Skeleton
          sx={{
            borderRadius: 20,
            width: '144px',
            height: '40px',
          }}
          variant="rectangular"
        />
      </Stack>
    </Stack>
  );
}
