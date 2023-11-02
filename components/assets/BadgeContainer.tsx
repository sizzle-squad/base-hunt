import { useGetBadges } from '@/hooks/useGetBadges';
import { Grid, Stack } from '@mui/material';
import { useAccount } from 'wagmi';
import { Badge } from './Badge';
import type { Badge as BadgeType } from '@/hooks/types';

type Props = {
  badges: BadgeType[];
};

export function BadgeContainer({ badges }: Props) {
  return (
    <Grid container>
      {badges?.map((badge) => (
        <Grid xs={3} sm={3}>
          <Badge
            key={badge.id}
            imageUrl={badge.nftUrl}
            isCompleted={badge.isCompleted}
          />
        </Grid>
      ))}
    </Grid>
  );
}
