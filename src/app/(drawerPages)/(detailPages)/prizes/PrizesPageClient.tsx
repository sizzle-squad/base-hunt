'use client';

import { useCallback, useMemo } from 'react';

import { NoSsr, Skeleton, Stack } from '@mui/material';
import Image from 'next/image';
import { useAccount } from 'wagmi';

import { Button } from '@/components/assets/Button';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import Text from '@/components/Text';
import { Color } from '@/constants/color';
import { GAME_ID } from '@/constants/gameId';
import { useLevels } from '@/hooks/useLevels';

export default function PrizesPageClient() {
  const { address } = useAccount();
  const {
    data,
    isLoading: isLevelsLoading,
    error: levelsError,
  } = useLevels({ gameId: GAME_ID, address: address ?? '' });

  const handleClaimPress = useCallback(
    (ctaUrl: string) => () => {
      window.open(ctaUrl, '_blank');
    },
    []
  );

  const loadingSkeleton = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, index) => (
        <Stack
          key={`skeleton-${index}`}
          direction="column"
          gap={1}
          p={2}
          sx={{ background: Color.White }}
          height="100%"
          width="336px"
          borderRadius="16px"
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={44} height={44} />
            <Stack direction="column">
              <Skeleton variant="text" width={100} height={30} />
              <Skeleton variant="text" width={200} height={20} />
            </Stack>
          </Stack>
          <Skeleton variant="rectangular" width={300} height={275} />
          <Skeleton variant="rounded" width={300} height={50} />
        </Stack>
      )),
    []
  );

  return (
    <Stack gap="24px" pb={10}>
      <DetailsPageNavbar title="Prizes" />
      <NoSsr>
        <Stack direction="column" alignItems="center" gap={3}>
          {isLevelsLoading
            ? loadingSkeleton
            : data.levels.map((level, index) => {
                const currentLevel =
                  data.currentLevelIdx === null
                    ? -1
                    : Number(data.currentLevelIdx);
                const isDisabled = currentLevel < index;

                return (
                  <Stack
                    direction="column"
                    key={`${level.id}-${index}`}
                    gap={1}
                    p={2}
                    sx={{ background: Color.White }}
                    height="100%"
                    width="336px"
                    borderRadius="16px"
                  >
                    <Stack direction="row" alignItems="center" gap={2}>
                      <Image
                        src={level.imageUrl ?? ''}
                        alt="jumbotron"
                        width={44}
                        height={44}
                      />
                      <Stack direction="column">
                        <Text variant="h6">Tier {level.level}</Text>
                        <Text variant="body1">{level.prizeDescription}</Text>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      py={2}
                      width="300px"
                      height="275px"
                    >
                      <Image
                        src={level.prizeImageUrl ?? ''}
                        alt="jumbotron"
                        width={200}
                        height={200}
                      />
                    </Stack>

                    <Button
                      href={level.ctaUrl}
                      variant="contained"
                      disabled={isDisabled}
                      bgColor={Color.CoinbaseBlue}
                      onClick={handleClaimPress(level.ctaUrl)}
                      textColor={Color.White}
                    >
                      {currentLevel >= index ? 'Claim' : 'Locked'}
                    </Button>
                  </Stack>
                );
              })}
        </Stack>
      </NoSsr>
    </Stack>
  );
}
