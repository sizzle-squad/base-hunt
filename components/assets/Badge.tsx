import { Box, Card, CardMedia } from '@mui/material';
import Image from 'next/image';

type Props = {
  imageUrl: string;
  isCompleted: boolean;
};
export function Badge({ imageUrl, isCompleted }: Props) {
  return (
    <Box sx={{ opacity: isCompleted ? 1 : 0.5 }} width={80} height={80}>
      <Image
        src={imageUrl}
        objectFit="cover"
        alt="jumbotron"
        width={74}
        height={66}
      />
    </Box>
  );
}
