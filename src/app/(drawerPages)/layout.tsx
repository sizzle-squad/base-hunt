import Footer from '@/components/navigation/footer';
import { NavigationProgressBar } from '@/components/navigation/navbar/NavigationProgress';
import { DrawerProvider } from '@/context/DrawerContext';

export default function ArtRevealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DrawerProvider>
      <NavigationProgressBar />
      {children}
      <Footer />
    </DrawerProvider>
  );
}
