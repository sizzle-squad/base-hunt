'use client';

import { useState } from 'react';
import LeaderBoardRow from '@/components/list/LeaderboardRow';
import { TopContributorTag } from '@/components/list/TopContributorTag';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { GAME_ID } from '@/constants/gameId';
import { GuildRank, PlayerRank } from '@/hooks/types';
import { useTopRanks } from '@/hooks/useTopRanks';
import {
  Box,
  NoSsr,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { useMemo } from 'react';
import Text from '@/components/Text';
import ListRow from '@/components/list/ListRow';

type RankMock =
  | PlayerRank
  | (GuildRank & {
      isMock: boolean;
    });

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

type BoardType = 'leaderboard' | 'guilds';

function getName({
  selectedBoard,
  rank,
}: {
  selectedBoard: BoardType;
  rank: PlayerRank | GuildRank | RankMock;
}) {
  return selectedBoard === 'guilds'
    ? (rank as GuildRank).name
    : (rank as PlayerRank).userAddress;
}

// TODO: build out a hook
const topGuildRanks: GuildRank[] = [
  {
    rank: '1',
    name: 'Guild 1',
    currentScore: 100,
  },
];

export default function LeaderboardClient() {
  const [selectedBoard, setSelectedBoard] = useState<BoardType>('leaderboard');

  const { data: topRanks, isLoading } = useTopRanks({ gameId: GAME_ID });

  const leaderboardData = useMemo(() => {
    if (selectedBoard === 'guilds') {
      return {
        topContributor: topGuildRanks[0],
        restOfRanks: topGuildRanks.slice(1),
        totalCount: topGuildRanks.length,
      };
    }

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
  }, [selectedBoard, topRanks]);

  const RowComp = useMemo(() => {
    return selectedBoard === 'guilds' ? ListRow : LeaderBoardRow;
  }, [selectedBoard]);

  return (
    <>
      <DetailsPageNavbar />
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        marginLeft="24px"
        gap={2}
      >
        <ToggleButtonGroup
          value={selectedBoard}
          exclusive
          onChange={(_, newBoard) => setSelectedBoard(newBoard)}
          sx={{
            outlineColor: 'black',
            '.Mui-selected': {
              '&:hover': {
                backgroundColor: 'white',
              },
              backgroundColor: 'white !important',
            },
          }}
        >
          <ToggleButton
            sx={{
              height: '52px',
              borderRadius: '12px',
              width: '140px',
            }}
            value="leaderboard"
          >
            Leaderboard
          </ToggleButton>
          <ToggleButton
            value="guilds"
            sx={{
              height: '52px',
              borderRadius: '12px',
              width: '140px',
            }}
          >
            Guilds
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
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
              <TopContributorTag isGuild={selectedBoard === 'guilds'} />
              <RowComp
                name={getName({
                  selectedBoard,
                  rank: leaderboardData.topContributor,
                })}
                score={leaderboardData.topContributor.currentScore}
                position={0}
                offset={1}
                isLast
              />
            </Stack>
            <Box>
              {leaderboardData.restOfRanks.map(
                (rank: PlayerRank | GuildRank | RankMock, index: number) => {
                  const name = getName({ selectedBoard, rank });
                  if ('isMock' in rank) {
                    // rank is treated as RankMock here
                    return (
                      <RowComp
                        key={`mock-${index}`}
                        name={name}
                        position={index}
                        offset={2}
                        isLast={
                          index === leaderboardData.restOfRanks.length - 1
                        }
                        score={rank.currentScore}
                      />
                    );
                  } else {
                    // rank is treated as Rank here
                    return (
                      <RowComp
                        key={`${rank}-${index}`}
                        name={name}
                        position={index}
                        offset={2}
                        isLast={
                          index === leaderboardData.restOfRanks.length - 1
                        }
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
    </>
  );
}
