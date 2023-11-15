import { DrawerProvider } from '@/context/DrawerContext';

export default function BadgesLayout({
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
