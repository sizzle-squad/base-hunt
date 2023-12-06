import { Avatar, Box, Skeleton, Stack } from '@mui/material';
import Text from '@/components/Text';
import { PlayerRank } from '@/hooks/types';
import { useMemo } from 'react';
import { stringToColor } from '@/utils/stringToColor';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useUserName } from '@/hooks/useUsername';

type Props = {
  rank: PlayerRank;
  position: number;
  offset: number;
  isLast?: boolean;
};

export default function LeaderBoardRow({
  rank,
  position,
  offset,
  isLast,
}: Props) {
  const { data: userPublicProfile, isLoading } = useCBProfile({
    address: rank.userAddress,
  });
  const displayName =
    useUserName({
      address: rank.userAddress,
      userPublicProfile,
    }) ?? rank.userAddress;

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
        {displayName}
      </Text>
    );
  }, [displayName, isLoading]);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      alignSelf="stretch"
      borderRadius={borderRadiusStyle}
      display="flex"
      gap="20px"
      padding="20px"
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
          <Avatar
            sx={{
              borderRadius: '100px',
              backgroundColor: stringToColor(displayName),
              width: '24px',
              height: '24px',
              flexDirection: 'column',
            }}
          >
            {''}
          </Avatar>
          {content}
        </Stack>
      </Stack>
      <Text
        textAlign="right"
        width={80}
        variant="body1"
        fontWeight={500}
        noWrap
      >{`${rank.currentScore} pts`}</Text>
    </Stack>
  );
}
