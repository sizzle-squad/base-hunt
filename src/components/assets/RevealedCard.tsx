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
          The art reveal has finished
        </Text>
        <Text variant="body2" align="center" sx={{ lineHeight: '150%' }}>
          Thank you for your contribution
        </Text>
      </Stack>
      <Button href={ctaLink} onClick={onClick}>
        Learn more
      </Button>
    </Stack>
  );
}
