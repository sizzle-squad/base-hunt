'use client';

import { useCallback } from 'react';

import { Stack } from '@mui/material';
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

  const handleClaimPress = useCallback(() => {}, []);

  return (
    <Stack gap="24px" pb={10}>
      <DetailsPageNavbar title="Prizes" />
      <Stack direction="column" alignItems="center" gap={3}>
        {data.levels.map((level, index) => {
          const currentLevel =
            data.currentLevelIdx === null ? -1 : Number(data.currentLevelIdx);

          const isDisabled = currentLevel < index;
          return (
            <Stack
              direction="column"
              key={level.id}
              gap={1}
              p={2}
              sx={{ background: Color.White }}
              height="100%"
              width="336px"
            >
              <Stack direction="column" alignItems="center">
                <Image
                  src={level.prizeImageUrl}
                  alt="jumbotron"
                  width={200}
                  height={200}
                />
              </Stack>
              <Text variant="body2">Merch</Text>
              <Text variant="h5">Tier {level.level}</Text>
              <Text variant="body1">Tier {level.prizeDescription}</Text>
              <Button
                href={level.ctaUrl}
                variant="contained"
                disabled={isDisabled}
              >
                {currentLevel >= index ? 'Claim' : 'Locked'}
              </Button>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
