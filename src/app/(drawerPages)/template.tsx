'use client';
import Footer from '@/components/navigation/footer';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export default function Template(props: any) {
  const pathname = usePathname();
  const noShowRoutes = useMemo(() => ['/levels', '/boosts'], []);
  const showFooter = useMemo(
    () => !noShowRoutes.includes(pathname),
    [pathname, noShowRoutes]
  );

  return (
    <div>
      {props.children}
      {showFooter && <Footer />}
    </div>
  );
}
