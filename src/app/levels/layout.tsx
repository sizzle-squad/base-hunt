import { DrawerProvider } from '@/context/DrawerContext';
import dynamic from 'next/dynamic';

export default function LevelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DrawerProvider>{children}</DrawerProvider>
    </>
  );
}
