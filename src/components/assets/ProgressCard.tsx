import { Box, Stack } from '@mui/material';
import Text from '@/components/Text';
import { ArtRevealProgressBar } from './ArtRevealProgressBar';
import { Button } from './Button';
import { Card } from './Card';

type Props = {
  progress: number;
  ctaText: string;
  currentPoints?: bigint;
  totalPoints?: bigint;
  onPress: () => void;
};

export function ProgressCard({
  progress,
  ctaText,
  currentPoints,
  totalPoints,
  onPress,
}: Props) {
  if (!currentPoints || !totalPoints) return null;

  return (
    <Card>
      <Stack direction="row" gap="2px" alignItems="center">
        <Text variant="h5">{currentPoints.toString()}</Text>
        <Box>/</Box>
        <Text variant="body2" noWrap>
          {`${totalPoints.toString()} hp`}
        </Text>
      </Stack>
      <ArtRevealProgressBar progress={progress} />
      <Button onClick={onPress}>{ctaText}</Button>
    </Card>
  );
}
