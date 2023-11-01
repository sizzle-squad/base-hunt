import Image from 'next/image';
import { Box, Container, Stack } from '@mui/material';

type Props = {
  imageUrl: string;
  width?: number;
  height?: number;
  isCircular?: boolean;
};

export function Jumbotron({
  imageUrl,
  isCircular,
  width = 500,
  height = 500,
}: Props) {
  return (
    <Stack
      border="4px solid black"
      borderRadius={isCircular ? '50%' : ''}
      overflow="hidden"
      width={`${width}px`}
      height={`${height}px`}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Image
        src={imageUrl}
        width="500"
        height="500"
        objectFit="cover"
        alt="jumbotron"
      />
    </Stack>
  );
}
