'use client';

import { Box, Link, Skeleton, Stack } from '@mui/material';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { useGuildState } from '@/hooks/useGuildState';
import { GAME_ID } from '@/constants/gameId';
import { useGuild } from '@/hooks/useGuild';
import Text from '@/components/Text';
import Pill from '@/components/Pill';
import { Color } from '@/constants/color';
import { Button } from '@/components/assets/Button';
import { getReferralLink } from '@/utils/guild/getReferralLink';
import { useIsBetaTestersByFeature } from '@/hooks/useIsBetaTester';
import { GuildDetailRow } from './GuildDetailRow';

export default function Page({ params }: { params: { guildId: string } }) {
  const { address } = useAccount();
  const isBetaTester = useIsBetaTestersByFeature({
    address,
    feature: 'referrals',
  });
  const router = useRouter();
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

  const isLoading = useMemo(
    () => isMyGuildLoading || isGuildsLoading,
    [isGuildsLoading, isMyGuildLoading]
  );

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

  const loadingSkeleton = useMemo(
    () => (
      <Stack gap={3}>
        <Stack direction="row" gap={2}>
          <Skeleton variant="rounded" width={90} height={90} />
          <Stack direction="column" gap={2}>
            <Stack gap={0.5}>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={150} height={25} />
            </Stack>
            <Skeleton variant="rounded" width={95} height={30} />
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
          <Skeleton variant="text" width={150} height={25} />
        </Stack>
        <Stack direction="column">
          {Array.from({ length: 6 }).map((_, index) => (
            <Stack
              key={`skeleton-${index}`}
              direction="row"
              justifyContent="space-between"
              pt={1.5}
              pb={2}
              sx={{
                borderTop: '1px solid #C6C6C6',
              }}
            >
              <Skeleton variant="text" width={100} height={25} />
              <Skeleton variant="text" width={50} height={25} />
            </Stack>
          ))}
        </Stack>
      </Stack>
    ),
    []
  );

  return (
    <Stack className="pageContent" gap={3}>
      <DetailsPageNavbar title="" goBack={router.back} />
      {isLoading || !currentGuild ? (
        loadingSkeleton
      ) : (
        <Stack gap={3}>
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
                src={currentGuild.imageUrl ?? '/images/plus.png'}
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
          {isBetaTester ? (
            <Stack
              direction="column"
              gap={1.5}
              p={2}
              borderRadius="14px"
              sx={{
                background: Color.White,
              }}
            >
              <Text variant="h5" fontSize="20px">
                Grow your guild
              </Text>
              <Text variant="body2" fontSize="14px">
                Invite your friends to your guild using Warpcast Frame
              </Text>
              <Button
                variant="outlined"
                bgColor={Color.White}
                textColor={Color.Black}
              >
                <Link
                  href={getReferralLink({ address, gameId: GAME_ID, id: '' })}
                  target="_blank"
                  sx={{
                    textDecoration: 'none',
                    color: Color.Black,
                  }}
                >
                  <Text
                    variant="body1"
                    color={Color.Black}
                    sx={{ textDecoration: 'none' }}
                  >
                    Recruit on Warpcast
                  </Text>
                </Link>
              </Button>
            </Stack>
          ) : null}
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
            <Text variant="body1">{`${currentGuild.currentScore} txn pts`}</Text>
          </Stack>
          <Stack direction="column">
            <GuildDetailRow
              title={`Today's Rank`}
              value={`#${currentGuild.rank}`}
            />
            <GuildDetailRow
              title="Days Won"
              value={`${currentGuild.winShares}/7 days`}
            />
            {myGuildDetails}
            <GuildDetailRow
              title="Members"
              value={currentGuild.totalMemberCount ?? 0}
            />
            {currentGuild.socialLink ? (
              <GuildDetailRow title="Social" value={currentGuild.socialLink} />
            ) : null}
            <GuildDetailRow
              title="Total Referral Count"
              value={currentGuild.totalReferralCount ?? '-'}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
