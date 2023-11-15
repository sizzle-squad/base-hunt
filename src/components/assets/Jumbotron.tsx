import { Stack } from '@mui/material';
import Image from 'next/image';

export function Jumbotron() {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{
        pt: 18,
        pb: 30,
      }}
    >
      <Image
        src="/images/logo.svg"
        width="260"
        height="150"
        objectFit="contain"
        alt="jumbotron"
      />
    </Stack>
  );
}
