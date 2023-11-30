import { Stack } from '@mui/material';
import LevelsPageClient from './LevelsClient';

export default function Page() {
  return (
    <Stack gap="24px" mt="24px" className="pageContent">
      <LevelsPageClient />
    </Stack>
  );
}
