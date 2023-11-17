import { Skeleton, Stack, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Stack
      sx={{
        height: '100vh',
        alignItems: 'start',
        paddingY: '10px',
      }}
    >
      <Stack direction={'row'} justifyContent={'space-between'} width={'100%'}>
        <Skeleton
          sx={{
            variant: 'rectangular',
            width: '135px',
            height: '40px',
            mb: '-40px',
            borderRadius: '15px',
          }}
        />
        <Stack direction={'row'} gap={1}>
          <Skeleton
            sx={{
              variant: 'rectangular',
              width: '55px',
              height: '40px',
              mb: '-40px',
              borderRadius: '15px',
            }}
          />
          <Skeleton
            sx={{
              variant: 'rectangular',
              width: '55px',
              height: '40px',
              mb: '-40px',
              borderRadius: '15px',
            }}
          />
        </Stack>
      </Stack>
      <Skeleton
        sx={{
          variant: 'rectangular',
          width: '100%',
          height: '225px',
          mb: '-40px',
        }}
      />
      <Skeleton
        sx={{
          variant: 'rectangular',
          width: '100%',
          height: '100px',
        }}
      />

      <Typography
        sx={{
          fontSize: '1.5rem',
          fontFamily: 'CoinbaseDisplay',
          fontWeight: 400,
          mb: '-20px',
        }}
      >
        IRL Badges
      </Typography>
      <Skeleton
        sx={{
          variant: 'rectangular',
          width: '100%',
          height: '100px',
        }}
      />
      <Typography
        sx={{
          fontSize: '1.5rem',
          fontFamily: 'CoinbaseDisplay',
          fontWeight: 400,
          mb: '-20px',
        }}
      >
        Online Badges
      </Typography>
      <Skeleton
        sx={{
          variant: 'rectangular',
          width: '100%',
          height: '100px',
        }}
      />
    </Stack>
  );
}
