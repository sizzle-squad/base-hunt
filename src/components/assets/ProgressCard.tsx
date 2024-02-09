import { Box, Stack } from '@mui/material';

import Text from '@/components/Text';
import { UNIT } from '@/constants/unit';

import { Button } from './Button';
import { Card } from './Card';
import { NextLevelProgressBar } from './NextLevelProgressBar';

type Props = {
  ctaText: string;
  isCTADisabled?: boolean;
  isLoading?: boolean;
  onPress: () => void;
  nextClick: string | null;
};

export function ProgressCard({
  ctaText,
  onPress,
  isCTADisabled,
  isLoading,
  nextClick,
}: Props) {
  return (
    <Card>
      <NextLevelProgressBar />
      {/* TODO: add a tooltip on users with 0 pt cannot make a request */}
      <Button onClick={onPress} disabled={isCTADisabled} isLoading={isLoading}>
        {nextClick ? `Next tap ${nextClick}` : ctaText}
      </Button>
    </Card>
  );
}
