'use client';

import { useCallback } from 'react';

import { Box, Grid, Stack } from '@mui/material';
import Image from 'next/image';
import { useAccount, useSignMessage } from 'wagmi';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/assets/Button';
import Text from '@/components/Text';
import { Color } from '@/constants/color';
import { GAME_ID } from '@/constants/gameId';
import { Guild } from '@/hooks/types';
import { useMutateGuild } from '@/hooks/useMutateGuild';
import { ModalPill } from '@/components/ModalPill';
import { useGameInfoContext } from '@/context/GameInfoContext';
import { GuildModal } from './GuildModal';

export function GuildCardList({ guilds }: { guilds: Guild[] }) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { joinGuild } = useMutateGuild();
  const router = useRouter();
  const { setShowModal } = useGameInfoContext();

  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, [setShowModal]);

  const handleJoinPress = useCallback(
    (guildId: string, guildName: string) => async () => {
      const signature = await signMessageAsync({
        message: `Joining ${guildName}:${guildId} with wallet:${address?.toLowerCase()} for base-hunt:${GAME_ID} for eth-denver`,
      });

      joinGuild.mutate(
        {
          gameId: GAME_ID,
          userAddress: address,
          guildId: guildId,
          signature,
        },
        {
          onSuccess: () => {
            return router.push(`/guild/${guildId}`);
          },
        }
      );
    },
    [address, joinGuild, router, signMessageAsync]
  );

  return (
    <Stack
      direction="column"
      alignItems="center"
      pb={10}
      sx={{ flexGrow: 1 }}
      gap={1}
    >
      <Box pt={3}>
        <ModalPill value="How guilds work" onClick={toggleModal} />
      </Box>
      <Box pt={2}>
        <Text textAlign="center" whiteSpace="pre-wrap">
          Join a guild, earn more points and have more fun! <br />
          If your guild has the most points at the end of each day (5 PM MST),
          you’ll earn extra points for that day. You’ll have 7 opportunities to
          win the daily guild challenge. Choose wisely!
        </Text>
      </Box>
      <Grid
        container
        sx={{ width: '100%', flexGrow: 1, pt: 3 }}
        justifyContent="center"
      >
        {guilds.map((guild) => {
          if (!guild.isEnabled) return;

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
                    onClick={handleJoinPress(guild.id.toString(), guild.name)}
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
      <GuildModal />
    </Stack>
  );
}
