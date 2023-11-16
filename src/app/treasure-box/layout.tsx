import { DrawerProvider } from '@/context/DrawerContext';

export default function TreasureBoxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DrawerProvider>{children}</DrawerProvider>;
}
