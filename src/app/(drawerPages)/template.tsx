'use client';
import { ReactNode, useMemo } from 'react';

import { Stack } from '@mui/material';
import { usePathname } from 'next/navigation';

import Footer from '@/components/navigation/footer';

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noShowRoutes = useMemo(
    () => [/^\/levels$/, /^\/thanks$/, /^\/guild\/.+$/],
    []
  );
  const showFooter = useMemo(() => {
    return !noShowRoutes.some((regex) => regex.test(pathname));
  }, [pathname, noShowRoutes]);

  return (
    <Stack
      justifyContent="space-between"
      width="100vw"
      height="100vh"
      paddingBottom={9}
    >
      {children}
      {showFooter && <Footer />}
    </Stack>
  );
}
