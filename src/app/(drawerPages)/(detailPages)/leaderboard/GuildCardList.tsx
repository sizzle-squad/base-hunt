'use client';

import { useCallback } from 'react';

import { Box, Grid, Stack } from '@mui/material';
import Image from 'next/image';
import { useAccount } from 'wagmi';

import { Button } from '@/components/assets/Button';
import Text from '@/components/Text';
import { Color } from '@/constants/color';
import { GAME_ID } from '@/constants/gameId';
import { Guild } from '@/hooks/types';
import { useMutateGuild } from '@/hooks/useMutateGuild';

export function GuildCardList({ guilds }: { guilds: Guild[] }) {
  const { address } = useAccount();
  const { joinGuild } = useMutateGuild();

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
    <Stack direction="column" alignItems="center" pb={10} sx={{ flexGrow: 1 }}>
      <Grid
        container
        sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        {guilds.map((guild) => {
          return (
            <Grid item md={3} key={guild.id} sx={{ pb: 2 }}>
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
                width="336px"
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
                        src="https://go.wallet.coinbase.com/static/base-hunt/base-house.jpg"
                        alt="jumbotron"
                        height={90}
                        width={90}
                      />
                    </Box>
                    <Stack direction="column" gap={0.5}>
                      <Text variant="body2">Guild</Text>
                      <Text variant="h5">{guild.name}</Text>
                      <Text variant="body1">{guild.leader}</Text>
                    </Stack>
                  </Stack>
                  <Button
                    onClick={handleJoinPress(guild.id.toString())}
                    variant="contained"
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
