import { Stack } from '@mui/material';

export default function PaddedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack gap="24px" paddingY="24px" paddingX="20px" marginBottom="100px">
      {children}
    </Stack>
  );
}
