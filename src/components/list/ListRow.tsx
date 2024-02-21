import { ReactNode, useMemo } from 'react';

import { Avatar, Box, Skeleton, Stack } from '@mui/material';

import Text from '@/components/Text';
import { stringToColor } from '@/utils/stringToColor';

type Props = {
  name: string;
  position: number;
  offset: number;
  isLast?: boolean;
  isLoading?: boolean;
  score: number;
  startContent?: ReactNode;
  profileTile?: ReactNode;
  onClick?: () => void;
};

export default function ListRow({
  position,
  offset,
  isLast,
  isLoading,
  name,
  score,
  startContent,
  profileTile,
  onClick,
}: Props) {
  const borderRadiusStyle = useMemo(() => {
    // single row should have rounded corners
    if (isLast && position === 0) return '12px';

    // top row should have top rounded corners
    if (position === 0) return '12px 12px 0 0';

    // last row should have bottom rounded corners
    if (isLast) return '0 0 12px 12px';
  }, [isLast, position]);

  const content = useMemo(() => {
    if (isLoading) {
      return <Skeleton variant="text" width={150} height={24} />;
    }

    return (
      <Text variant="body1" noWrap>
        {name}
      </Text>
    );
  }, [isLoading, name]);

  return (
    <Stack
      direction="column"
      borderRadius={borderRadiusStyle}
      display="flex"
      padding="20px"
      bgcolor="var(--White, #fff)"
      gap={2}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
      }}
    >
      {startContent}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        alignSelf="stretch"
        gap="20px"
        display="flex"
        bgcolor="var(--White, #fff)"
      >
        <Box width="30px">
          <Text variant="body1">{position + offset}</Text>
        </Box>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignSelf="stretch"
          display="flex"
          gap="8px"
          flexGrow={1}
        >
          <Stack
            direction="row"
            justifyContent="flex-start"
            gap="8px"
            display="flex"
          >
            {profileTile ?? (
              <Avatar
                sx={{
                  borderRadius: '100px',
                  backgroundColor: stringToColor(name),
                  width: '24px',
                  height: '24px',
                  flexDirection: 'column',
                }}
              >
                {''}
              </Avatar>
            )}
            <Stack direction="column" justifyContent="center">
              {content}
            </Stack>
          </Stack>
        </Stack>

        <Text
          textAlign="right"
          width={80}
          variant="body1"
          fontWeight={500}
          noWrap
        >
          {`${score} pts`}
        </Text>
      </Stack>
    </Stack>
  );
}
