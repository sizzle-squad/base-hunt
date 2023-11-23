import { Box, Stack } from '@mui/material';
import Text from '@/components/Text';
import { ArtRevealProgressBar } from './ArtRevealProgressBar';
import { Button } from './Button';
import { Card } from './Card';
import { UNIT } from '@/constants/unit';

type Props = {
  ctaText: string;
  currentPoints?: bigint;
  totalPoints?: bigint;
  onPress: () => void;
};

export function ProgressCard({
  ctaText,
  currentPoints,
  totalPoints,
  onPress,
}: Props) {
  if (!currentPoints || !totalPoints) return null;

  return (
    <Card>
      <ArtRevealProgressBar />
      <Button onClick={onPress}>{ctaText}</Button>
    </Card>
  );
}
