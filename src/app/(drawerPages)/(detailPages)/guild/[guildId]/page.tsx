'use client';

import { Box, Stack } from '@mui/material';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { useMemo } from 'react';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { useGuildState } from '@/hooks/useGuildState';
import { GAME_ID } from '@/constants/gameId';
import { useGuild } from '@/hooks/useGuild';
import Text from '@/components/Text';
import Pill from '@/components/Pill';
import { Color } from '@/constants/color';
import { GuildDetailRow } from './GuildDetailRow';

export default function Page({ params }: { params: { guildId: string } }) {
  const { address } = useAccount();
  const {
    data: myGuild,
    isLoading: isMyGuildLoading,
    error: myGuildError,
    hasGuild,
  } = useGuildState({
    gameId: GAME_ID,
    userAddress: address,
  });
  const {
    data: guilds,
    isLoading: isGuildsLoading,
    error: guildsError,
  } = useGuild({ gameId: GAME_ID });

  const currentGuild = useMemo(() => {
    if (guilds.length === 0) return null;
    return guilds.find((guild) => guild.id === params.guildId);
  }, [guilds, params.guildId]);

  const myGuildDetails = useMemo(() => {
    if (myGuild && myGuild.guildId === currentGuild?.id) {
      return (
        <>
          <GuildDetailRow
            title="Points available"
            value={myGuild.claimablePoints}
          />
          <GuildDetailRow
            title="Points claimed"
            value={myGuild.claimedPoints}
          />
        </>
      );
    }
    return null;
  }, [currentGuild?.id, myGuild]);

  // TODO: handle no current guild
  if (!currentGuild) {
    return null;
  }

  return (
    <Stack className="pageContent">
      <Stack gap={3}>
        <DetailsPageNavbar title="" />
        <Stack direction="row" gap={2}>
          <Box
            sx={{
              width: '110px',
              height: '110px',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <Image
              src={currentGuild.imageUrl ?? '/images/solo.svg'}
              alt="Guild badge"
              width={110}
              height={110}
            />
          </Box>
          <Stack direction="column" gap={1}>
            {myGuild && myGuild.guildId === currentGuild.id && (
              <Pill>
                <Text variant="body1">Your guild</Text>
              </Pill>
            )}
            <Text variant="h5">{currentGuild.name}</Text>
            <Text variant="body1">{currentGuild.leader}</Text>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          gap={1.5}
          p={2}
          borderRadius="12px"
          sx={{
            background: Color.White,
          }}
        >
          <Image
            src="/images/base-logo.svg"
            alt="Base logo"
            width={24}
            height={24}
          />
          <Text variant="body1">{`${currentGuild.currentScore} tx today`}</Text>
        </Stack>
        <Stack direction="column">
          <GuildDetailRow title={`Today's Rank`} value={currentGuild.rank} />
          <GuildDetailRow
            title="Top Guild"
            value={`${currentGuild.winShares}/7 days`}
          />
          {myGuildDetails}
          <GuildDetailRow
            title="Members"
            value={currentGuild.totalMemberCount ?? 0}
          />
          <GuildDetailRow title="Discord" value="---" />
        </Stack>
      </Stack>
    </Stack>
  );
}
