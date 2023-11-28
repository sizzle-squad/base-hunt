'use client';

import LeaderBoardRow from '@/components/list/LeaderboardRow';
import { TopContributorTag } from '@/components/list/TopContributorTag';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { GAME_ID } from '@/constants/gameId';
import { Rank } from '@/hooks/types';
import { useTopRanks } from '@/hooks/useTopRanks';
import { Box, NoSsr, Stack } from '@mui/material';
import { useMemo } from 'react';

export default function LeaderboardClient() {
  const { data: topRanks, isLoading, error } = useTopRanks({ gameId: GAME_ID });

  const topContributor = useMemo(() => {
    return topRanks[0];
  }, [topRanks]);

  const restOfRanks = useMemo(() => topRanks.slice(1), [topRanks]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DetailsPageNavbar title="Leaderboard" />
      <NoSsr>
        <Stack direction="column" mt="24px" gap="24px">
          <Stack direction="column" gap={1}>
            <TopContributorTag />
            <LeaderBoardRow
              rank={topContributor}
              position={0}
              offset={1}
              isLast
            />
          </Stack>
          <Box>
            {restOfRanks.map((rank: Rank, index: number) => {
              return (
                <LeaderBoardRow
                  key={rank.createdAt}
                  rank={rank}
                  position={index}
                  offset={2}
                  isLast={index === restOfRanks.length - 1}
                />
              );
            })}
          </Box>
        </Stack>
      </NoSsr>
    </>
  );
}
