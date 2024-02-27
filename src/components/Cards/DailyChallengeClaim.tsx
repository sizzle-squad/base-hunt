import { use, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Card, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import { GAME_ID } from '@/constants/gameId';
import { useMutateGuildDailyChallenge } from '@/hooks/useMutateGuildDailyChallenge';
import { useGuildState } from '@/hooks/useGuildState';
import Text from '@/components/Text';
import { Button } from '@/components/assets/Button';
import { Color } from '@/constants/color';

export function DailyChallengeClaim() {
  const { address } = useAccount();
  const theme = useTheme();
  const greaterThanMid = useMediaQuery(theme.breakpoints.up('md'));

  const {
    data: guildState,
    isLoading: isGuildStateLoading,
    error: guildStateError,
    hasGuild,
  } = useGuildState({
    gameId: GAME_ID,
    userAddress: address,
  });
  const { claimDailyChallenge } = useMutateGuildDailyChallenge();

  const handleGuildDailyChallengeClaimPress = useCallback(() => {
    claimDailyChallenge.mutate({
      gameId: GAME_ID,
      userAddress: address,
    });
  }, [address, claimDailyChallenge]);

  if (!guildState?.claimablePoints) {
    return null;
  }

  return (
    <Grid item width="100%" xs={12} sm={5.5} lg={2.75}>
      <Card
        sx={{
          height: '100%',
          p: 2,
          borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        <Stack
          alignItems="center"
          gap={2}
          height="100%"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            borderRadius={100}
            bgcolor="var(--Muted-Blue, #B0CAFF)"
            display="flex"
            padding="4px 8px"
            alignItems="center"
            gap={1}
          >
            <Text
              flexGrow={1}
              whiteSpace="nowrap"
              variant="body1"
              textAlign="center"
            >
              Congratulations
            </Text>
          </Stack>
          <Text
            variant={greaterThanMid ? 'h4' : 'h5'}
            align="center"
            width="200px"
          >
            Your guild won the Daily Challenge
          </Text>
          <Button
            variant="contained"
            onClick={handleGuildDailyChallengeClaimPress}
            isLoading={claimDailyChallenge.isLoading}
            bgColor={Color.CoinbaseBlue}
          >
            <Text fontSize="16px" lineHeight="18px" fontWeight={400}>
              {claimDailyChallenge.isSuccess
                ? 'Points claimed!'
                : `Claim ${guildState?.claimablePoints} points`}
            </Text>
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
}
