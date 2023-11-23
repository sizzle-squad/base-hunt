import { DrawerProvider } from '@/context/DrawerContext';

export default function BoostsLayout({
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
