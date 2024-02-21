import { Link, Stack } from '@mui/material';
import { useMemo } from 'react';
import Text from '@/components/Text';

type Props = {
  title: string;
  value: string | number;
};

export function GuildDetailRow({ title, value }: Props) {
  const valueContent = useMemo(() => {
    if (typeof value === 'string' && value.includes('https://')) {
      return (
        <Link href={value} target="_blank">
          <Text variant="body1">{value}</Text>
        </Link>
      );
    }

    return <Text variant="body1">{value}</Text>;
  }, [value]);

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
      {valueContent}
    </Stack>
  );
}
