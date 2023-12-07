'use client';
import Footer from '@/components/navigation/footer';
import { Box, Skeleton, Stack } from '@mui/material';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noShowRoutes = useMemo(
    () => ['/levels', '/boosts', '/leaderboard'],
    []
  );
  const showFooter = useMemo(
    () => !noShowRoutes.includes(pathname),
    [pathname, noShowRoutes]
  );

  return (
    <Stack
      justifyContent="space-between"
      width="100vw"
      height={['100%', '100vh']}
    >
      <Box>{children}</Box>
      {showFooter && <Footer />}
    </Stack>
  );
}
