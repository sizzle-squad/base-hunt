'use client';

import { useCallback } from 'react';

import { Box, Grid, Stack } from '@mui/material';
import Image from 'next/image';
import { useAccount } from 'wagmi';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/assets/Button';
import Text from '@/components/Text';
import { Color } from '@/constants/color';
import { GAME_ID } from '@/constants/gameId';
import { Guild } from '@/hooks/types';
import { useMutateGuild } from '@/hooks/useMutateGuild';

export function GuildCardList({ guilds }: { guilds: Guild[] }) {
  const { address } = useAccount();
  const { joinGuild } = useMutateGuild();
  const router = useRouter();

  const handleCardPress = useCallback(
    (guildId: string) => () => {
      return router.push(`/guild/${guildId}`);
    },
    [router]
  );

  const handleJoinPress = useCallback(
    (guildId: string) => () => {
      joinGuild.mutate({
        gameId: GAME_ID,
        userAddress: address,
        guildId: guildId,
      });
    },
    [address, joinGuild]
  );

  return (
    <Stack
      direction="column"
      alignItems="center"
      pb={10}
      sx={{ flexGrow: 1 }}
      gap={1}
    >
      <Box pt={2}>
        <Text textAlign="center" whiteSpace="pre-wrap">
          Join a guild, earn more points and have more fun! <br />
          If your guild has the most points at the end of each day (5 PM MST),
          you’ll earn an extra 100 points for that day. You’ll have 7
          opportunities to win the daily guild challenge. Choose wisely!
        </Text>
      </Box>
      <Grid
        container
        sx={{ width: '100%', flexGrow: 1, pt: 3 }}
        justifyContent="center"
      >
        {guilds.map((guild) => {
          return (
            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              key={guild.id}
              spacing={1}
              sx={{
                pb: 2,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Stack
                direction="column"
                gap={1}
                p={2}
                sx={{
                  background: Color.White,
                  borderRadius: '14px',
                  cursor: 'pointer',
                }}
                height="100%"
                width="90%"
                minWidth="336px"
                onClick={handleCardPress(guild.id.toString())}
              >
                <Stack direction="column" alignItems="center" gap="12px">
                  <Stack
                    direction="row"
                    alignItems="center"
                    width="100%"
                    gap={2}
                  >
                    <Box
                      sx={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        width: '90px',
                        height: '90px',
                      }}
                    >
                      <Image
                        src={guild.imageUrl!}
                        alt="jumbotron"
                        height={90}
                        width={90}
                      />
                    </Box>
                    <Stack direction="column" gap={0.5}>
                      <Text variant="h6" pb={1.5}>
                        {guild.name}
                      </Text>
                      <Text variant="body2">Guild leader</Text>
                      <Text variant="body1">{guild.leader}</Text>
                    </Stack>
                  </Stack>
                  <Button
                    onClick={handleJoinPress(guild.id.toString())}
                    variant="contained"
                    isLoading={
                      joinGuild.isLoading &&
                      joinGuild.variables?.guildId === guild.id.toString()
                    }
                    disabled={
                      joinGuild.isLoading &&
                      joinGuild.variables?.guildId !== guild.id.toString()
                    }
                  >
                    Join guild
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
