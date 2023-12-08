import Link from 'next/link';
import { memo } from 'react';
import { Button } from './assets/Button';
import Text from '@/components/Text';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Stack } from '@mui/material';

export const BoostLinkButton = memo(() => {
  return (
    <Link href="/boosts">
      <Button>
        <Stack direction="row" gap={1}>
          <AutoAwesomeIcon />
          <Text fontWeight={400}>Get more points</Text>
        </Stack>
      </Button>
    </Link>
  );
});

BoostLinkButton.displayName = 'BoostLinkButton';
