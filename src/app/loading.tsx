import { Skeleton, Stack } from '@mui/material';

export default function Loading() {
  return (
    <Stack
      sx={{
        height: '100vh',
        alignItems: 'center',
        py: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Skeleton
        sx={{
          width: '320px',
          height: '225px',
        }}
      />

      <Stack>
        <Skeleton
          sx={{
            width: '320px',
            height: '75px',
          }}
        />
        <Skeleton
          sx={{
            width: '320px',
            height: '75px',
          }}
        />
      </Stack>
    </Stack>
  );
}
