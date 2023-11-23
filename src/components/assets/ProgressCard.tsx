import { Box, Button, Card, Stack } from '@mui/material';
import Text from '@/components/Text';
import { ArtRevealProgressBar } from './ArtRevealProgressBar';

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
    <Card
      sx={{
        p: '20px',
        borderRadius: '12px',
        bgcolor: 'white',
        overflow: 'visible',
        width: '335px',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        gap="16px"
      >
        <Stack direction="row" gap="2px" alignItems="center">
          <Text variant="h5">{currentPoints.toString()}</Text>
          <Box>/</Box>
          <Text variant="body2" noWrap>
            {`${totalPoints.toString()} hp`}
          </Text>
        </Stack>
        <ArtRevealProgressBar progress={progress} />
        <Button
          sx={{
            px: '20px',
            py: '16px',
            borderRadius: '1rem',
            bgcolor: 'text.primary',
            color: 'white',
            textAlign: 'center',
          }}
          onClick={onPress}
        >
          {ctaText}
        </Button>
        {/* <Box
          sx={{
            px: '20px',
            py: '16px',
            borderRadius: '1rem',
            bgcolor: 'text.primary',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Text color="#fff">{ctaText}</Text>
        </Box> */}
      </Stack>
    </Card>
  );
}
