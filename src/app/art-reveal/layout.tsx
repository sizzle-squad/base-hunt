import { DrawerProvider } from '@/context/DrawerContext';

export default function ArtRevealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DrawerProvider>{children}</DrawerProvider>;
}
