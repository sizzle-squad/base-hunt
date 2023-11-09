import { Box, Card, CardMedia } from '@mui/material';
import Image from 'next/image';
import type { Badge as BadgeType } from '@/hooks/types';
import Link from 'next/link';

type Props = {
  imageUrl: URL | string;
  isCompleted: boolean;
  badge: BadgeType;
};
export function Badge({ imageUrl, isCompleted, badge }: Props) {
  return (
    <Link href={`/badges/${badge.id}`}>
      <Box sx={{ opacity: isCompleted ? 1 : 0.5 }} width={80} height={80}>
        <Image
          src={imageUrl as string}
          alt="jumbotron"
          sizes="100vw"
          width={74}
          height={66}
        />
      </Box>
    </Link>
  );
}
