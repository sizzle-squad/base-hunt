'use client';
import { Stack } from '@mui/material';
import Text from '@/components/Text';

export default function Metrics() {
  const gameId = process.env.NEXT_PUBLIC_GAME_ID ?? '0';

  return (
    <Stack
      width="100%"
      margin="auto"
      alignItems="center"
      p="20px"
      gap="20px"
      bgcolor="black"
      height="100vh"
      justifyContent="center"
    >
        <Stack
          width="100%"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
            <Text useMonoFont fontSize="40px" color="white">Placeholder data</Text>
      </Stack>
    </Stack>
  );
}
