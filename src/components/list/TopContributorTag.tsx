import { Stack } from '@mui/material';

import Text from '@/components/Text';

export function TopContributorTag({ isGuild }: { isGuild?: boolean }) {
  return (
    <Stack
      direction="row"
      borderRadius={100}
      bgcolor="var(--Yellow, #FFD200)"
      display="flex"
      padding="4px 8px"
      alignItems="center"
      width="93px"
      gap={1}
    >
      <Text
        flexGrow={1}
        whiteSpace="nowrap"
        fontSize={14}
        lineHeight="17px"
        fontWeight={400}
        variant="h6"
        textAlign="center"
      >
        {`Top ${isGuild ? 'Guild' : 'Player'}`}
      </Text>
    </Stack>
  );
}
