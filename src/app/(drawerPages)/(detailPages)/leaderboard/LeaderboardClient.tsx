'use client';

import LeaderBoardRow from '@/components/list/LeaderboardRow';
import { TopContributorTag } from '@/components/list/TopContributorTag';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { GAME_ID } from '@/constants/gameId';
import { Rank } from '@/hooks/types';
import { useTopRanks } from '@/hooks/useTopRanks';
import { Box, NoSsr, Stack } from '@mui/material';
import { useCallback, useMemo } from 'react';
import Text from '@/components/Text';

type RankMock = Rank & {
  isMock: boolean;
};

export default function LeaderboardClient() {
  const { data: topRanks, isLoading } = useTopRanks({ gameId: GAME_ID });

  const generateMockData = useCallback((count: number) => {
    // Function to generate 'count' number of mock leaderboard entries
    const mockData: RankMock[] = [];
    for (let i = 0; i < count; i++) {
      mockData.push({
        cbid: null,
        createdAt: '',
        ensName: null,
        gameId: 0,
        id: 0,
        tapCount: 0,
        userAddress: '...',
        isMock: true,
        totalHitpoints: 0,
      });
    }
    return mockData;
  }, []);

  // Add logic to integrate mock data
  const leaderboardData = useMemo(() => {
    const realDataCount = topRanks.length;
    const mockDataCount = 10 - realDataCount;
    return realDataCount < 10
      ? [...topRanks, ...generateMockData(mockDataCount)]
      : topRanks;
  }, [topRanks, generateMockData]);

  const topContributor = useMemo(() => leaderboardData[0], [leaderboardData]);
  const restOfRanks = useMemo(
    () => leaderboardData.slice(1),
    [leaderboardData]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DetailsPageNavbar title="Leaderboard" />
      <NoSsr>
        {leaderboardData.length === 0 ? (
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
              <TopContributorTag />
              <LeaderBoardRow
                rank={topContributor as Rank}
                position={0}
                offset={1}
                isLast
              />
            </Stack>
            <Box>
              {restOfRanks.map((rank: Rank | RankMock, index: number) => {
                if ('isMock' in rank) {
                  // rank is treated as RankMock here
                  return (
                    <LeaderBoardRow
                      key={`mock-${index}`}
                      rank={rank}
                      position={index}
                      offset={2}
                      isLast={index === restOfRanks.length - 1}
                    />
                  );
                } else {
                  // rank is treated as Rank here
                  return (
                    <LeaderBoardRow
                      key={rank.createdAt}
                      rank={rank}
                      position={index}
                      offset={2}
                      isLast={index === restOfRanks.length - 1}
                    />
                  );
                }
              })}
            </Box>
          </Stack>
        )}
      </NoSsr>
    </>
  );
}