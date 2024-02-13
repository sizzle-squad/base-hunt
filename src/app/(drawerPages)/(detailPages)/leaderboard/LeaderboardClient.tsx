'use client';

import { useState } from 'react';

import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import Text from '@/components/Text';

import { GuildLeaderboard } from './GuildLeaderboard';
import { PlayerLeaderboard } from './PlayerLeaderboard';

type BoardType = 'leaderboard' | 'guilds';

export default function LeaderboardClient() {
  const [selectedBoard, setSelectedBoard] = useState<BoardType>('leaderboard');

  return (
    <>
      <DetailsPageNavbar />
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        marginLeft="24px"
        gap={3}
      >
        <ToggleButtonGroup
          value={selectedBoard}
          exclusive
          onChange={(_, newBoard) => setSelectedBoard(newBoard)}
          sx={{
            outlineColor: 'black',
            '.Mui-selected': {
              '&:hover': {
                backgroundColor: 'white',
              },
              backgroundColor: 'white !important',
            },
          }}
        >
          <ToggleButton
            sx={{
              height: '52px',
              borderRadius: '12px',
              width: '140px',
            }}
            value="leaderboard"
          >
            Leaderboard
          </ToggleButton>
          <ToggleButton
            value="guilds"
            sx={{
              height: '52px',
              borderRadius: '12px',
              width: '140px',
            }}
          >
            Guilds
          </ToggleButton>
        </ToggleButtonGroup>
        {selectedBoard === 'leaderboard' ? null : (
          <Text variant="body1">
            Complete transactions on Base to help your guild win the Daily
            Challenge
          </Text>
        )}
      </Stack>
      {selectedBoard === 'leaderboard' ? (
        <PlayerLeaderboard />
      ) : (
        <GuildLeaderboard />
      )}
    </>
  );
}
