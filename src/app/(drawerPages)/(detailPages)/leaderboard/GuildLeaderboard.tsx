'use client';

import { TopContributorTag } from '@/components/list/TopContributorTag';
import { Guild as GuildRank } from '@/hooks/types';
import { Box, NoSsr, Stack } from '@mui/material';
import { useMemo } from 'react';
import ListRow from '@/components/list/ListRow';
import { useGuild } from '@/hooks/useGuild';
import { GAME_ID } from '@/constants/gameId';
import { GuildCardList } from './GuildCardList';
import { useAccount } from 'wagmi';
import { useGuildState } from '@/hooks/useGuildState';

type RankMock = GuildRank & {
  isMock: boolean;
};

const topRankFallback = {
  id: '0',
  name: 'Guild',
  currentScore: 0,
  guildId: '99',
  totalMemberCount: null,
  leader: '',
  rank: '0',
};

function generateGuildRankData() {
  const mockData: RankMock[] = [];
  for (let i = 0; i < 6; i++) {
    mockData.push({
      id: i.toString(),
      name: 'Guild',
      currentScore: 0,
      gameId: 0,
      totalMemberCount: null,
      leader: '',
      rank: '0',
      isMock: true,
    });
  }
  return mockData;
}

export function GuildLeaderboard() {
  const { address } = useAccount();
  const {
    data: guildState,
    isLoading: isGuildStateLoading,
    error: guildStateError,
    hasGuild,
  } = useGuildState({
    gameId: GAME_ID,
    userAddress: address,
  });

  const {
    data: topGuildRanks,
    isLoading: isTopGuildRanksLoading,
    error,
  } = useGuild({ gameId: GAME_ID });

  const leaderboardData = useMemo(() => {
    // this is serving as a fallback while top guild ranks are loading
    if (isTopGuildRanksLoading) {
      const mocked = generateGuildRankData();

      return {
        topContributor: mocked[0],
        restOfRanks: mocked.slice(1),
        totalCount: mocked.length,
      };
    }

    return {
      topContributor: topGuildRanks[0] ?? topRankFallback,
      restOfRanks: topGuildRanks.slice(1),
      totalCount: topGuildRanks.length,
    };
  }, [isTopGuildRanksLoading, topGuildRanks]);

  return (
    <NoSsr>
      {!hasGuild ? (
        <GuildCardList guilds={topGuildRanks} />
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
              isLoading={isTopGuildRanksLoading}
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
                    isLoading={isTopGuildRanksLoading}
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
