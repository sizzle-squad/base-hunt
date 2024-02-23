'use client';

import { useEffect, useState } from 'react';

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import { ArtIcon } from '@/components/assets/icons/ArtIcon';
import { ArtRevealIcon } from '@/components/assets/icons/ArtRevealIcon';
import { LocationIcon } from '@/components/assets/icons/LocationIcon';
import { ChallengesSelectedIcon } from '@/components/assets/icons/ChallengesSelectedIcon';
import { PrizeSelectedIcon } from '@/components/assets/icons/PrizesSelectedIcon';
import { LeaderboardSelectedIcon } from '@/components/assets/icons/LeaderboardSelectedIcon';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(pathname);

  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  return (
    <Box position="fixed" bottom="0" width="100vw">
      <Paper
        sx={{
          bottom: 0,
          left: 0,
          right: 0,
          py: '8px',
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            router.push(newValue);
          }}
        >
          <BottomNavigationAction
            sx={{
              '.Mui-selected': {
                color: '#000',
              },
            }}
            label="Challenges"
            value="/challenges"
            icon={
              value === '/challenges' ? (
                <ChallengesSelectedIcon />
              ) : (
                <ArtIcon color="none" />
              )
            }
          />
          <BottomNavigationAction
            sx={{
              '.Mui-selected': {
                color: '#000',
              },
            }}
            label="Leaderboard"
            value="/leaderboard"
            icon={
              value.includes('leaderboard') ? (
                <LeaderboardSelectedIcon />
              ) : (
                <ArtRevealIcon color="none" />
              )
            }
          />
          <BottomNavigationAction
            sx={{
              '.Mui-selected': {
                color: '#000',
              },
            }}
            label="Prizes"
            value="/prizes"
            icon={
              value === '/prizes' ? (
                <PrizeSelectedIcon />
              ) : (
                <LocationIcon color="none" />
              )
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
