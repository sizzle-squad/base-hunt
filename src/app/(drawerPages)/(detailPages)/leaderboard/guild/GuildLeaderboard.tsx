'use client';

import { useCallback, useMemo } from 'react';

import {
  Box,
  Card,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  NoSsr,
  Skeleton,
  Stack,
} from '@mui/material';
import { useAccount } from 'wagmi';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListRow from '@/components/list/ListRow';
import { TopContributorTag } from '@/components/list/TopContributorTag';
import { GAME_ID } from '@/constants/gameId';
import { Guild as GuildRank } from '@/hooks/types';
import { useGuild } from '@/hooks/useGuild';
import { useGuildState } from '@/hooks/useGuildState';
import Text from '@/components/Text';

import { CountdownTimer } from '@/components/Countdown';
import { DailyChallengeClaim } from '@/components/Cards/DailyChallengeClaim';
import { BootstrapDialog } from '@/components/BoostrapDialog';
import { Button } from '@/components/assets/Button';
import { useGameInfoContext } from '@/context/GameInfoContext';
import Pill from '@/components/Pill';
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
  const { showModal, setShowModal } = useGameInfoContext();

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
        the end of the day (5 PM MST) will receive 100 extra points for each
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
        <Pill backgroundColor="none" onClick={toggleModal} hover>
          <Text>How guilds work</Text>
          {showModal ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Pill>
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
    showModal,
    toggleModal,
  ]);

  return (
    <NoSsr>
      {guildCardListSkeleton}
      {hasNoGuild && !isLoading ? (
        <GuildCardList guilds={topGuildRanks} />
      ) : (
        leaderboard
      )}
      <BootstrapDialog
        onClose={() => setShowModal(false)}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          How guilds work
        </DialogTitle>
        <DialogContent>
          <Text gutterBottom lineHeight="160%">
            • If your guild has the most points at the end of each day (5 PM
            MST), you’ll earn an <b>extra 100 points</b> for that day.
          </Text>
          <Text gutterBottom lineHeight="160%">
            • 1 point = 1 transaction on Base. Guild points are updated hourly.
          </Text>
          <Text gutterBottom lineHeight="160%">
            • The guild that wins the most days (out of 7) wins Base Hunt. In
            the event of a tie, we’ll look at total points to break the tie.
          </Text>
          <Text gutterBottom lineHeight="160%">
            • Once you’re in a guild, you cannot switch guilds. Choose wisely!
          </Text>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>
            <Text>Got it!</Text>
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </NoSsr>
  );
}
