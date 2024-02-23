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
import { Color } from '@/constants/color';

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
              <ArtIcon
                color={value === '/challenges' ? Color.Positive : 'none'}
              />
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
              <LocationIcon
                color={value.includes('leaderboard') ? Color.Positive : 'none'}
              />
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
              <ArtRevealIcon
                color={value === '/prizes' ? Color.Positive : 'none'}
              />
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
