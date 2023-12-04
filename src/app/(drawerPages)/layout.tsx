import Footer from '@/components/navigation/footer';
import { DrawerProvider } from '@/context/DrawerContext';
import { Box } from '@mui/material';

export default function ArtRevealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DrawerProvider>
      <Box maxWidth={390} sx={{ margin: '0 auto' }}>
        {children}
        <Footer />
      </Box>
    </DrawerProvider>
  );
}
