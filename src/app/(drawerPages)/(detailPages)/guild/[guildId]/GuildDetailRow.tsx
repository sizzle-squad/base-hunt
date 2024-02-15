import { Stack } from '@mui/material';
import Text from '@/components/Text';

type Props = {
  title: string;
  value: string | number;
};

export function GuildDetailRow({ title, value }: Props) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      pt={1.5}
      pb={2}
      sx={{
        borderTop: '1px solid #C6C6C6',
      }}
    >
      <Text variant="body1">{title}</Text>
      <Text variant="body1">{value}</Text>
    </Stack>
  );
}
