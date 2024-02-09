import { Grid, Stack } from '@mui/material';

import type { Badge as BadgeType } from '@/hooks/types';

import { Badge } from './Badge';

type Props = {
  badges: BadgeType[];
};

export default function BadgeContainer({ badges }: Props) {
  return (
    <Grid container columns={2} gap={2}>
      {badges?.map((badge) => (
        <Badge
          badge={badge}
          key={badge.id}
          imageUrl={badge.imageUrl}
          isCompleted={badge.isCompleted}
        />
      ))}
    </Grid>
  );
}
