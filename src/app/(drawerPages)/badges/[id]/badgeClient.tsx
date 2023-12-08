'use client';

import OwnershipPill from '@/components/Badges/OwnershipPill';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { GAME_ID } from '@/constants/gameId';
import { useDrawer } from '@/context/DrawerContext';
import { useClientCheck } from '@/hooks/useClientCheck';
import { useGameState } from '@/hooks/useGameState';
import { Button, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import Text from '@/components/Text';
import { BadgeLocationMap } from '@/components/Map/BadgeLocationMap';
import Link from 'next/link';
import { format } from 'date-fns';
import { BadgeTypeEnum } from '@/hooks/types';
import Pill from '@/components/Pill';
import useScreenSize from '@/hooks/useScreenSize';
import SendIcon from '@mui/icons-material/Send';

type Props = {
  params: { id: string };
};
const googleMapNavigationUrl = `https://www.google.com/maps/dir/?api=1`;

export default function BadgeDetails({ params }: Props) {
  const { id } = params;
  const { address, isDisconnected } = useAccount();
  const router = useRouter();
  const { drawerStates } = useDrawer();
  const screenSize = useScreenSize();
  const imageSize = useMemo(() => {
    return screenSize === 'small' ? 256 : screenSize === 'medium' ? 384 : 512;
  }, [screenSize]);

  function getNavigationUrl(latLng: string) {
    return `${googleMapNavigationUrl}&destination=${latLng}&dir_action=navigate`;
  }

  const isClient = useClientCheck();
  const { data, isLoading, error } = useGameState({
    userAddress: address,
    gameId: GAME_ID,
  });

  const { badges } = data;

  const currentBadge = useMemo(() => {
    if (!badges) return null;
    return badges.find((badge) => badge.id === id);
  }, [badges, id]);

  const isOwned = useMemo(() => {
    return Boolean(currentBadge?.isCompleted);
  }, [currentBadge]);

  const twitterShareUrl = useMemo(() => {
    const copy = process.env.NEXT_PUBLIC_SHARE_COPY ?? '';
    const badgeTitle = currentBadge?.name;
    const text = `
    ${copy}

    ${badgeTitle}
    `;
    const host =
      process.env.NODE_ENV === 'production'
        ? `https://${window.location.hostname}`
        : `http://${window.location.hostname}`;

    const url = `${host}/badges/${currentBadge?.id}`; // Replace with actual badge URL
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
  }, [currentBadge]);

  const SharePill = useMemo(() => {
    return (
      <Pill backgroundColor="black">
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: 'white',
          }}
        >
          <Text color="white">Share</Text>
          <SendIcon color="inherit" />
        </a>
      </Pill>
    );
  }, [twitterShareUrl]);

  useEffect(() => {
    if (isDisconnected) {
      router.push('/');
    }
  }, [isDisconnected, router]);

  useEffect(() => {
    drawerStates.badgeActions.bottom = true;
  }, [currentBadge, drawerStates.badgeActions]);

  const ctaButton = useMemo(() => {
    if (isOwned || !currentBadge || currentBadge.type === BadgeTypeEnum.IRL) {
      return null;
    } else if (currentBadge.type === BadgeTypeEnum.Online) {
      return (
        <Button variant="contained" href={currentBadge.ctaUrl}>
          Mint
        </Button>
      );
    }
  }, [currentBadge, isOwned]);

  const content = useMemo(() => {
    const title = currentBadge?.name as string;
    if (currentBadge && currentBadge.type !== BadgeTypeEnum.Online) {
      const [lat, lng] = currentBadge.latLng
        .split(',')
        .map((coord) => parseFloat(coord));

      return (
        <Stack
          gap={1}
          px="20px"
          py="24px"
          sx={{
            background: 'white',
          }}
          marginBottom={['5rem', 'unset']}
        >
          <Stack direction="column" gap={1}>
            <Stack direction="column" gap={1}>
              <Stack flexDirection="row" justifyContent="space-between">
                <Text color="black" fontWeight={400} fontSize="24px">
                  {title}
                </Text>
                <Link href={getNavigationUrl(currentBadge?.latLng)}>
                  <Pill backgroundColor="black">
                    <Text color="white">Get Directions</Text>
                  </Pill>
                </Link>
              </Stack>
              {currentBadge.artistName && (
                <Text color="black" fontWeight={400}>
                  {currentBadge.artistName}
                </Text>
              )}
            </Stack>
            <Text color="black">{currentBadge.description}</Text>
            {isOwned && currentBadge.completedTimestamp && (
              <Text color="black" fontWeight={700}>
                Badge found{' '}
                {format(
                  new Date(currentBadge.completedTimestamp),
                  'do MMMM yyyy'
                )}
              </Text>
            )}
            {ctaButton}
          </Stack>
          <BadgeLocationMap
            height="350px"
            width="100%"
            lat={lat}
            lng={lng}
            roundedBorder
          />
        </Stack>
      );
    } else if (currentBadge && currentBadge.type === BadgeTypeEnum.Online) {
      return (
        <Stack
          gap={1}
          px="20px"
          py="24px"
          sx={{
            background: 'white',
          }}
          marginBottom={['5rem', 'unset']}
        >
          <Stack direction="column" gap={1}>
            <Stack direction="column" gap={1}>
              <Stack flexDirection="row" justifyContent="space-between">
                <Text color="black" fontWeight={400} fontSize="24px">
                  {title}
                </Text>
              </Stack>
              {currentBadge.artistName && (
                <Text color="black" fontWeight={400}>
                  {currentBadge.artistName}
                </Text>
              )}
            </Stack>
            <Text color="black">{currentBadge.description}</Text>
            {isOwned && currentBadge.completedTimestamp && (
              <Text color="black" fontWeight={700}>
                Art collected on{' '}
                {format(
                  new Date(currentBadge.completedTimestamp),
                  'do MMMM yyyy'
                )}
              </Text>
            )}
            {ctaButton}
          </Stack>
        </Stack>
      );
    } else {
      // TODO: we may want to error handle here
      return null;
    }
  }, [currentBadge, ctaButton, isOwned]);

  if (!isClient) return null;

  return (
    <Stack
      height="100vh"
      sx={{
        background: isOwned
          ? 'linear-gradient(180deg, #0A0B0D 0%, #26292F 100%)'
          : 'var(--Gray, #E3E3E3);',
      }}
    >
      {currentBadge && (
        <Stack
          height={['100%']}
          justifyContent="space-between"
          gap="24px"
          sx={{
            color: 'white',
            alignItems: 'center',
          }}
        >
          <Box width="100%" paddingY="24px" paddingX="20px">
            <DetailsPageNavbar title="" owned={isOwned} />
          </Box>
          <Stack gap="24px" alignItems="center">
            <Box
              sx={{
                filter: isOwned ? 'grayscale(0)' : 'grayscale(1)',
                background: 'var(--Gray, #E3E3E3);',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow:
                  '0px 4px 4px 0px rgba(0, 0, 0, 0.10), 0px 8px 12px 0px rgba(0, 0, 0, 0.10), 0px 24px 32px 0px rgba(0, 0, 0, 0.10)',
              }}
              marginTop={['0', '24px', '60px']}
              minHeight="256px"
            >
              <Image
                src={currentBadge.imageUrl.toString()}
                alt={currentBadge.name}
                width={imageSize}
                height={imageSize}
                sizes={`100vw`}
              />
            </Box>
            <Stack flexDirection="row" gap={1}>
              <OwnershipPill owned={isOwned} />
              {isOwned && SharePill}
            </Stack>
          </Stack>
          <Box width="100%">{content}</Box>
        </Stack>
      )}
    </Stack>
  );
}
