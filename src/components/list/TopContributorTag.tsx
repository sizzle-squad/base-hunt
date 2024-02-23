import { Stack } from '@mui/material';

import Text from '@/components/Text';

type Props = {
  value: string;
  bgColor?: string;
  color?: string;
};

export function TopContributorTag({
  value,
  bgColor = 'var(--Yellow, #FFD200)',
  color = 'var(--Black, #000000)',
}: Props) {
  return (
    <Stack
      direction="row"
      borderRadius={100}
      bgcolor={bgColor}
      display="flex"
      padding="4px 8px"
      alignItems="center"
      width="fit-content"
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
        color={color}
      >
        {value}
      </Text>
    </Stack>
  );
}
