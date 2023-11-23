import { DrawerProvider } from '@/context/DrawerContext';

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
