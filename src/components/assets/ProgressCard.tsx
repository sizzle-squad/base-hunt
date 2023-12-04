import { ArtRevealProgressBar } from './ArtRevealProgressBar';
import { Button } from './Button';
import { Card } from './Card';

type Props = {
  ctaText: string;
  isCTADisabled?: boolean;
  onPress: () => void;
};

export function ProgressCard({ ctaText, onPress, isCTADisabled }: Props) {
  return (
    <Card>
      <ArtRevealProgressBar />
      {/* TODO: add a tooltip on users with 0 pt cannot make a request */}
      <Button onClick={onPress} disabled={isCTADisabled}>
        {ctaText}
      </Button>
    </Card>
  );
}
