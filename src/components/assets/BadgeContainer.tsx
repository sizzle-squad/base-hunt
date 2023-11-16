import { Grid, Stack } from '@mui/material';
import { useAccount } from 'wagmi';
import { Badge } from './Badge';
import type { Badge as BadgeType } from '@/hooks/types';

type Props = {
  badges: BadgeType[];
};

export default function BadgeContainer({ badges }: Props) {
  return (
    <Grid container>
      {badges?.map((badge) => (
        <Grid key={badge.id} xs={3} sm={3} item>
          <Badge
            badge={badge}
            key={badge.id}
            imageUrl={badge.imageUrl}
            isCompleted={badge.isCompleted}
          />
        </Grid>
      ))}
    </Grid>
  );
}
