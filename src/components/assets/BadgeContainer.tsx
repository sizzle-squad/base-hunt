import { Grid, Skeleton, Stack } from '@mui/material';
import { Badge } from './Badge';
import type { Badge as BadgeType } from '@/hooks/types';
import { Suspense } from 'react';

type Props = {
  badges: BadgeType[];
};

function SkeletonBadgeContainer() {
  return (
    <Grid container columns={2} gap={2}>
      {[1, 2, 3, 4]?.map((key) => (
        <Skeleton
          key={key}
          sx={{
            variant: 'rectangular',
            width: '146px',
            height: '172px',
            mb: '-40px',
          }}
        />
      ))}
    </Grid>
  );
}

export default function BadgeContainer({ badges }: Props) {
  return (
    <Suspense fallback={<SkeletonBadgeContainer />}>
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
    </Suspense>
  );
}
