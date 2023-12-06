import { Avatar, Box, Card, Stack } from '@mui/material';
import Text from '@/components/Text';
import { PlayerRank, Rank } from '@/hooks/types';
import { useMemo } from 'react';
import { getTruncatedAddress } from '@/utils/truncate';
import { stringToColor } from '@/utils/stringToColor';

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
  const displayName = useMemo(() => {
    // if (rank.ensName) return rank.ensName;
    // if (rank.cbid) return rank.cbid;

    return getTruncatedAddress(rank.userAddress);
  }, [rank.userAddress]);

  const borderRadiusStyle = useMemo(() => {
    // single row should have rounded corners
    if (isLast && position === 0) return '12px';

    // top row should have top rounded corners
    if (position === 0) return '12px 12px 0 0';

    // last row should have bottom rounded corners
    if (isLast) return '0 0 12px 12px';
  }, [isLast, position]);

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
          <Text variant="body1">{displayName}</Text>
        </Stack>
      </Stack>
      <Text variant="body1" fontWeight={500}>{`${rank.currentScore} pts`}</Text>
    </Stack>
  );
}
