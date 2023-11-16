import { DrawerProvider } from '@/context/DrawerContext';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/navigation/footer'), {
  ssr: false,
});

export default function BadgesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DrawerProvider>{children}</DrawerProvider>
      <Footer />
    </>
  );
}
