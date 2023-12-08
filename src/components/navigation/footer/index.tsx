'use client';

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArtIcon } from '@/components/assets/icons/ArtIcon';
import { LocationIcon } from '@/components/assets/icons/LocationIcon';
import { ArtRevealIcon } from '@/components/assets/icons/ArtRevealIcon';
import Link from 'next/link';
import { ActiveArtRevealIcon } from '@/components/assets/icons/ActiveArtRevealIcon';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(pathname);

  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  return (
    <Box position={['fixed', 'unset']} bottom="0" width="100vw">
      <Paper
        sx={{
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
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
            label="Art"
            value="/badges"
            icon={<ArtIcon color={value === '/badges' ? '#E1FF67' : 'none'} />}
          />
          <BottomNavigationAction
            sx={{
              '.Mui-selected': {
                color: '#000',
              },
            }}
            label="Locations"
            value="/locations"
            icon={
              <LocationIcon
                color={value === '/locations' ? '#E1FF67' : 'none'}
              />
            }
          />
          <BottomNavigationAction
            sx={{
              '.Mui-selected': {
                color: '#000',
              },
            }}
            label="Reveal"
            value="/art-reveal"
            icon={
              value === '/art-reveal' ? (
                <ActiveArtRevealIcon />
              ) : (
                <ArtRevealIcon />
              )
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
