'use client';

import { useMemo } from 'react';

import { Box, NoSsr, Stack } from '@mui/material';
import { useAccount } from 'wagmi';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import ListRow from '@/components/list/ListRow';
import { TopContributorTag } from '@/components/list/TopContributorTag';
import { GAME_ID } from '@/constants/gameId';
import { Guild as GuildRank } from '@/hooks/types';
import { useGuild } from '@/hooks/useGuild';
import { useGuildState } from '@/hooks/useGuildState';
import Text from '@/components/Text';

import { CountdownTimer } from '@/components/Countdown';
import { DailyChallengeClaim } from '@/components/Cards/DailyChallengeClaim';
import ListCard from '@/components/ListCard';
import { GuildCardList } from './GuildCardList';

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
      imageUrl: null,
      winShares: 0,
    });
  }
  return mockData;
}

export function GuildLeaderboard() {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const hasNoGuild = Boolean(searchParams.get('hasNoGuild'));

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

  const isLoading = useMemo(() => {
    return isGuildStateLoading || isTopGuildRanksLoading;
  }, [isGuildStateLoading, isTopGuildRanksLoading]);

  const leaderboardData = useMemo(() => {
    // this is serving as a fallback while top guild ranks are loading
    if (isLoading) {
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
  }, [isLoading, topGuildRanks]);

  const description = useMemo(() => {
    return (
      <Text variant="body1" py={3}>
        <b>Daily challenge: </b>The guild with the most transactions on Base at
        the end of the day (5 PM MST) will receive 100 extra points for each
        guild member.
      </Text>
    );
  }, []);

  const guildCardListSkeleton = useMemo(() => {
    if (hasNoGuild && isLoading) {
      return (
        <Stack direction="column" gap={1} pt={3}>
          <ListCard isLoading />
          <ListCard isLoading />
          <ListCard isLoading />
          <ListCard isLoading />
          <ListCard isLoading />
          <ListCard isLoading />
        </Stack>
      );
    }

    return null;
  }, [hasNoGuild, isLoading]);

  return (
    <NoSsr>
      {guildCardListSkeleton}
      {!hasGuild && !isLoading ? (
        <GuildCardList guilds={topGuildRanks} />
      ) : (
        <>
          <Stack direction="column" mt="24px" gap={1}>
            <DailyChallengeClaim />
            {description}
            <CountdownTimer />
            <Stack direction="column" gap={1}>
              <ListRow
                name={leaderboardData.topContributor.name}
                score={leaderboardData.topContributor.currentScore}
                position={0}
                offset={1}
                isLast
                isLoading={isTopGuildRanksLoading}
                startContent={<TopContributorTag isGuild />}
                profileTile={
                  <Box
                    sx={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      width: '45px',
                      height: '45px',
                    }}
                  >
                    <Image
                      src={
                        leaderboardData.topContributor.imageUrl ??
                        '/images/solo.svg'
                      }
                      alt="guild profile picture"
                      width={45}
                      height={45}
                    />
                  </Box>
                }
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
                      profileTile={
                        <Box
                          sx={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            width: '45px',
                            height: '45px',
                          }}
                        >
                          <Image
                            src={rank.imageUrl ?? '/images/solo.svg'}
                            alt="guild profile picture"
                            width={45}
                            height={45}
                          />
                        </Box>
                      }
                    />
                  );
                }
              )}
            </Box>
          </Stack>
        </>
      )}
    </NoSsr>
  );
}
