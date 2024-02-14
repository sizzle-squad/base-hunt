'use client';

import { Box, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { useState } from 'react';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';

import { GuildLeaderboard } from './guild/GuildLeaderboard';
import { PlayerLeaderboard } from './PlayerLeaderboard';

type Props = {
  selectedBoard?: 'leaderboard' | 'guilds';
};

export default function LeaderboardClient({
  selectedBoard = 'leaderboard',
}: Props) {
  const [currentBoard, setCurrentBoard] = useState(selectedBoard);

  return (
    <Box pb={9}>
      <DetailsPageNavbar />
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        marginLeft="24px"
        gap={3}
      >
        <ToggleButtonGroup
          value={currentBoard}
          exclusive
          onChange={(_, newBoard) => setCurrentBoard(newBoard)}
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
      </Stack>
      {currentBoard === 'leaderboard' ? (
        <PlayerLeaderboard />
      ) : (
        <GuildLeaderboard />
      )}
    </Box>
  );
}
