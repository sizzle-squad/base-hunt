import { DrawerProvider } from '@/context/DrawerContext';
import { Box } from '@mui/material';

export default function ArtRevealLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DrawerProvider>
      <Box sx={{ margin: '0 auto', width: '100%' }}>{children}</Box>
    </DrawerProvider>
  );
}
