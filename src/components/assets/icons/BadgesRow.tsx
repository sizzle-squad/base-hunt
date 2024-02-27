import { Stack } from '@mui/material';
import Image from 'next/image';

const height = 28;
const width = 29;

export function BadgesRow() {
  return (
    <Stack direction="row" gap="32px">
      <Image
        src="/images/badge-1.svg"
        alt="badge-1"
        width={width}
        height={height}
      />
      <Image
        src="/images/badge-2.svg"
        alt="badge-2"
        width={width}
        height={height}
      />
      <Image
        src="/images/badge-3.svg"
        alt="badge-3"
        width={width}
        height={height}
      />
      <Image
        src="/images/badge-4.svg"
        alt="badge-4"
        width={width}
        height={height}
      />
      <Image
        src="/images/badge-5.svg"
        alt="badge-5"
        width={width}
        height={height}
      />
    </Stack>
  );
}
