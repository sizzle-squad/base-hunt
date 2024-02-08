import { TopContributorTag } from '@/components/list/TopContributorTag';
import { Guild as GuildRank } from '@/hooks/types';
import { Box, NoSsr, Stack } from '@mui/material';
import { useMemo } from 'react';
import ListRow from '@/components/list/ListRow';
import Text from '@/components/Text';
import { useGuild } from '@/hooks/useGuild';
import { GAME_ID } from '@/constants/gameId';

export function GuildLeaderboard() {
  const {
    data: topGuildRanks,
    isLoading,
    error,
  } = useGuild({ gameId: GAME_ID });

  const leaderboardData = useMemo(() => {
    return {
      topContributor: topGuildRanks[0],
      restOfRanks: topGuildRanks.slice(1),
      totalCount: topGuildRanks.length,
    };
  }, [topGuildRanks]);

  return (
    <NoSsr>
      {leaderboardData.totalCount === 0 ? (
        <Stack
          direction="column"
          height="80vh"
          justifyContent="center"
          alignItems="center"
        >
          <Text variant="h6" align="center">
            No leaderboard found.
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" mt="24px" gap="24px">
          <Stack direction="column" gap={1}>
            <TopContributorTag isGuild />
            <ListRow
              name={leaderboardData.topContributor.name}
              score={leaderboardData.topContributor.currentScore}
              position={0}
              offset={1}
              isLast
            />
          </Stack>
          <Box>
            {leaderboardData.restOfRanks.map(
              (rank: GuildRank, index: number) => {
                return (
                  <ListRow
                    key={`guild-${rank}-${index}`}
                    name={rank.name}
                    position={index}
                    offset={2}
                    isLast={index === leaderboardData.restOfRanks.length - 1}
                    score={rank.currentScore}
                  />
                );
              }
            )}
          </Box>
        </Stack>
      )}
    </NoSsr>
  );
}
