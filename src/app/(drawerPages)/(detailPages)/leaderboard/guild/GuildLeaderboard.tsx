'use client';

import { useCallback, useMemo } from 'react';

import { Box, Card, Grid, NoSsr, Skeleton, Stack } from '@mui/material';
import { useAccount } from 'wagmi';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import ListRow from '@/components/list/ListRow';
import { TopContributorTag } from '@/components/list/TopContributorTag';
import { GAME_ID } from '@/constants/gameId';
import { Guild as GuildRank } from '@/hooks/types';
import { useGuild } from '@/hooks/useGuild';
import { useGuildState } from '@/hooks/useGuildState';
import Text from '@/components/Text';

import { CountdownTimer } from '@/components/Countdown';
import { DailyChallengeClaim } from '@/components/Cards/DailyChallengeClaim';
import { useGameInfoContext } from '@/context/GameInfoContext';
import { ModalPill } from '@/components/ModalPill';
import { GuildCardList } from './GuildCardList';
import { GuildModal } from './GuildModal';

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
      socialLink: '',
    });
  }
  return mockData;
}

export function GuildLeaderboard({ noGuild }: { noGuild: boolean }) {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const hasNoGuild = Boolean(searchParams.get('hasNoGuild') || noGuild);
  const router = useRouter();
  const { setShowModal } = useGameInfoContext();

  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, [setShowModal]);

  const {
    data: guildState,
    isLoading: isGuildStateLoading,
    error: guildStateError,
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
        the end of the day (5 PM MST) will receive 250 extra points for each
        guild member.
      </Text>
    );
  }, []);

  const guildCardListSkeleton = useMemo(() => {
    if (hasNoGuild && isGuildStateLoading) {
      return (
        <Stack direction="column" gap={1} pt={3}>
          <Grid
            container
            sx={{ width: '100%', flexGrow: 1, pt: 3 }}
            justifyContent="center"
          >
            {Array.from({ length: 6 }).map((_, index) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                  key={`skeleton-${index}`}
                  spacing={1}
                  sx={{
                    pb: 2,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Card
                    sx={{
                      borderRadius: '12px',
                      padding: '12px',
                      alignSelf: 'stretch',
                      width: '90%',
                    }}
                  >
                    <Stack direction="column" gap={2}>
                      <Stack direction="row" gap={2}>
                        <Skeleton variant="rounded" width={90} height={90} />
                        <Stack direction="column" gap={2}>
                          <Stack gap={1}>
                            <Skeleton variant="text" width={100} height={20} />
                            <Skeleton variant="text" width={150} height={25} />
                            <Skeleton variant="text" width={150} height={25} />
                          </Stack>
                        </Stack>
                      </Stack>
                      <Skeleton variant="rounded" width="100%" height={50} />
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      );
    }

    return null;
  }, [hasNoGuild, isGuildStateLoading]);

  const handleCardPress = useCallback(
    (guildId: string) => () => {
      return router.push(`/guild/${guildId}`);
    },
    [router]
  );

  const leaderboard = useMemo(() => {
    if (hasNoGuild) {
      return null;
    }

    return (
      <Stack direction="column" mt="24px" gap={1}>
        <ModalPill value="How guilds work" onClick={toggleModal} />
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
            isLoading={isLoading}
            startContent={<TopContributorTag value="Top Guild" />}
            onClick={handleCardPress(leaderboardData.topContributor.id)}
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
          {leaderboardData.restOfRanks.map((rank: GuildRank, index: number) => {
            return (
              <ListRow
                key={`guild-${rank}-${index}`}
                name={rank.name}
                position={index}
                offset={2}
                isLast={index === leaderboardData.restOfRanks.length - 1}
                score={rank.currentScore}
                isLoading={isLoading}
                onClick={handleCardPress(rank.id)}
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
          })}
        </Box>
      </Stack>
    );
  }, [
    description,
    handleCardPress,
    hasNoGuild,
    isLoading,
    leaderboardData.restOfRanks,
    leaderboardData.topContributor.currentScore,
    leaderboardData.topContributor.id,
    leaderboardData.topContributor.imageUrl,
    leaderboardData.topContributor.name,
    toggleModal,
  ]);

  return (
    <NoSsr>
      {guildCardListSkeleton}
      {hasNoGuild && !isLoading ? (
        <GuildCardList guilds={topGuildRanks.reverse()} />
      ) : (
        leaderboard
      )}
      <GuildModal />
    </NoSsr>
  );
}
