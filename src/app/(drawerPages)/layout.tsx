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
<<<<<<< HEAD
      <Box sx={{ margin: '0 auto', width: '100%' }}>
=======
      <Box maxWidth={390} sx={{ margin: '0 auto' }}>
>>>>>>> 8e5b0d0 (add max width to drawerpages group)
        {children}
        <Footer />
      </Box>
    </DrawerProvider>
  );
}
