'use client';

import { Stack } from '@mui/material';
import Text from '../Text';
import { Button } from './Button';

type Props = {
  onClick?: (args?: any) => void;
  ctaLink?: string;
};

export function RevealedCard({ onClick, ctaLink }: Props) {
  return (
    <Stack gap="16px" justifyContent="center" direction="column">
      <Stack justifyContent="center" direction="column">
        <Text variant="h6" align="center">
          Congratulations, the Art has been revealed.
        </Text>
        <Text variant="body2" align="center" sx={{ lineHeight: '150%' }}>
          If you contributed, it will be airdropped to you.
        </Text>
      </Stack>
      <Button href={ctaLink} onClick={onClick}>
        Learn more
      </Button>
    </Stack>
  );
}
