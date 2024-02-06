'use client';
import Footer from '@/components/navigation/footer';
import { Stack } from '@mui/material';
import { usePathname } from 'next/navigation';
import { ReactNode, useMemo } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noShowRoutes = useMemo(
    () => [
      /^\/levels$/,
      /^\/challenges$/,
      /^\/guild$/,
      /^\/leaderboard$/,
      /^\/thanks$/,
    ],
    []
  );
  const showFooter = useMemo(() => {
    return !noShowRoutes.some((regex) => regex.test(pathname));
  }, [pathname, noShowRoutes]);

  return (
    <Stack justifyContent="space-between" width="100vw" height={['100vh']}>
      {children}
      {showFooter && <Footer />}
    </Stack>
  );
}
