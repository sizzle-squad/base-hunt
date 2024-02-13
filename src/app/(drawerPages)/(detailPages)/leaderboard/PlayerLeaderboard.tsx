import { useMemo } from 'react';

import { Box, NoSsr, Stack } from '@mui/material';

import LeaderBoardRow from '@/components/list/LeaderboardRow';
import { TopContributorTag } from '@/components/list/TopContributorTag';
import Text from '@/components/Text';
import { GAME_ID } from '@/constants/gameId';
import { PlayerRank } from '@/hooks/types';
import { useTopRanks } from '@/hooks/useTopRanks';

type RankMock = PlayerRank & {
  isMock: boolean;
};

function generateMockData(count: number) {
  // Function to generate 'count' number of mock leaderboard entries
  const mockData: RankMock[] = [];
  for (let i = 0; i < count; i++) {
    mockData.push({
      userAddress: '0x...',
      isMock: true,
      currentScore: 0,
      rank: '',
    });
  }
  return mockData;
}

export function PlayerLeaderboard() {
  const { data: topRanks, isLoading } = useTopRanks({ gameId: GAME_ID });
  const leaderboardData = useMemo(() => {
    const realDataCount = topRanks.length;
    const mockDataCount = 10 - realDataCount;

    // Add logic to integrate mock data
    const rankList =
      realDataCount < 10
        ? [...topRanks, ...generateMockData(mockDataCount)]
        : topRanks;

    return {
      topContributor: rankList[0],
      restOfRanks: rankList.slice(1),
      totalCount: rankList.length,
    };
  }, [topRanks]);

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
            <LeaderBoardRow
              name={leaderboardData.topContributor.userAddress}
              score={leaderboardData.topContributor.currentScore}
              position={0}
              offset={1}
              isLast
              startContent={<TopContributorTag />}
            />
          </Stack>
          <Box>
            {leaderboardData.restOfRanks.map(
              (rank: PlayerRank | RankMock, index: number) => {
                if ('isMock' in rank) {
                  // rank is treated as RankMock here
                  return (
                    <LeaderBoardRow
                      key={`mock-${index}`}
                      name={rank.userAddress}
                      position={index}
                      offset={2}
                      isLast={index === leaderboardData.restOfRanks.length - 1}
                      score={rank.currentScore}
                    />
                  );
                } else {
                  // rank is treated as Rank here
                  return (
                    <LeaderBoardRow
                      key={`player-${rank}-${index}`}
                      name={rank.userAddress}
                      position={index}
                      offset={2}
                      isLast={index === leaderboardData.restOfRanks.length - 1}
                      score={rank.currentScore}
                    />
                  );
                }
              }
            )}
          </Box>
        </Stack>
      )}
    </NoSsr>
  );
}
