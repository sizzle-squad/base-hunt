import { Stack } from '@mui/material';
import { Card } from './Card';
import Text from '../Text';
import { Button } from './Button';

type Props = {
  onClick?: () => void;
};

export function RevealedCard({ onClick }: Props) {
  return (
    <Card>
      <Stack gap="16px" justifyContent="center" direction="column">
        <Stack justifyContent="center" direction="column">
          <Text variant="h6" align="center">
            The art reveal has finished
          </Text>
          <Text variant="body2" align="center" sx={{ lineHeight: '150%' }}>
            Thank you for your contribution
          </Text>
        </Stack>
        <Button onClick={onClick}>Learn more</Button>
      </Stack>
    </Card>
  );
}
