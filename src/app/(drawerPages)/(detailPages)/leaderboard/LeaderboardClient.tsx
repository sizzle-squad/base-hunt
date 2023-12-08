'use client';

import LeaderBoardRow from '@/components/list/LeaderboardRow';
import { TopContributorTag } from '@/components/list/TopContributorTag';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { GAME_ID } from '@/constants/gameId';
import { PlayerRank } from '@/hooks/types';
import { useTopRanks } from '@/hooks/useTopRanks';
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  NoSsr,
  Stack,
  Button,
} from '@mui/material';
import { useCallback, useMemo } from 'react';
import Text from '@/components/Text';
import Pill from '@/components/Pill';
import { useGameInfoContext } from '@/context/GameInfoContext';
import Link from 'next/link';
import { BootstrapDialog } from '@/components/BoostrapDialog';

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

export default function LeaderboardClient() {
  const { showModal, setShowModal } = useGameInfoContext();

  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, [setShowModal]);

  const { data: topRanks, isLoading } = useTopRanks({ gameId: GAME_ID });

  // Add logic to integrate mock data
  const leaderboardData = useMemo(() => {
    const realDataCount = topRanks.length;
    const mockDataCount = 10 - realDataCount;
    return realDataCount < 10
      ? [...topRanks, ...generateMockData(mockDataCount)]
      : topRanks;
  }, [topRanks]);

  const topContributor = useMemo(() => leaderboardData[0], [leaderboardData]);
  const restOfRanks = useMemo(
    () => leaderboardData.slice(1),
    [leaderboardData]
  );

  return (
    <>
      <DetailsPageNavbar title="Leaderboard" />
      <Stack alignItems="center" marginLeft="24px">
        <Pill onClick={toggleModal} hover>
          <Text align="center" sx={{ width: '75px' }}>
            Prizes
          </Text>
        </Pill>
      </Stack>
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
                rank={topContributor as PlayerRank}
                position={0}
                offset={1}
                isLast
              />
            </Stack>
            <Box>
              {restOfRanks.map((rank: PlayerRank | RankMock, index: number) => {
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
                      key={`${rank}-${rank.userAddress}`}
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
      <BootstrapDialog
        onClose={() => setShowModal(false)}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Prizes
        </DialogTitle>
        <DialogContent>
          <Text gutterBottom>
            1. Collect art and earn points to climb the leaderboard{' '}
            <Link href="/boosts">
              <Text color="#0253FF" display="inline">
                here.
              </Text>
            </Link>
          </Text>
          <Text gutterBottom>
            2. Points get you higher levels and move you up the leaderboard.
          </Text>
          <Text gutterBottom>
            3. Levels unlock merch discounts and other prizes.
          </Text>
          <Text gutterBottom>
            4. Get to the #1 spot on the leaderboard by 2:00 PM EST on Sunday
            December 11 to earn <b>$1,000</b> in USDC.
          </Text>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>
            <Text color="black">Ok!</Text>
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
