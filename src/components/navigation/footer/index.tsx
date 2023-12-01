'use client';

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Icon,
  Paper,
  Stack,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArtIcon } from '@/components/assets/icons/ArtIcon';
import { LocationIcon } from '@/components/assets/icons/LocationIcon';
import { ArtRevealIcon } from '@/components/assets/icons/ArtRevealIcon';
import { ActiveArtRevealIcon } from '@/components/assets/icons/ActiveArtRevealIcon';
import Link from '@/components/AnimatedLink';
import Text from '@/components/Text';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(pathname);

  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 500,
        margin: 'auto',
        paddingY: '12px',
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          router.push(newValue);
        }}
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <Link href="/badges">
          <Stack
            alignItems={'center'}
            sx={{
              '.Mui-selected': {
                color: '#000',
              },
              width: '100%',
            }}
          >
            <ArtIcon color={value === '/art' ? '#E1FF67' : 'none'} />
          </Stack>
          <Text>Art</Text>
        </Link>
        <Link href="/locations">
          <Stack
            alignItems={'center'}
            sx={{
              '.Mui-selected': {
                color: '#000',
              },
              width: '100%',
            }}
          >
            <LocationIcon color={value === '/locations' ? '#E1FF67' : 'none'} />
          </Stack>
          <Text>Locations</Text>
        </Link>
        <Link href="/art-reveal">
          <Stack
            alignItems={'center'}
            sx={{
              '.Mui-selected': {
                color: '#000',
              },
              width: '100%',
            }}
          >
            {value === '/art-reveal' ? (
              <ActiveArtRevealIcon />
            ) : (
              <ArtRevealIcon />
            )}
          </Stack>
          <Text>Grand Reveal</Text>
        </Link>
      </BottomNavigation>
    </Paper>
  );
}
