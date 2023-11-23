'use client';

import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArtIcon } from '@/components/assets/icons/ArtIcon';
import { LocationIcon } from '@/components/assets/icons/LocationIcon';
import { ArtRevealIcon } from '@/components/assets/icons/ArtRevealIcon';

export default function Footer() {
  const router = useRouter();
  const [value, setValue] = useState(0);

  const handleActionPress = useCallback(
    (route: string) => {
      return () => router.push(`/${route}/`);
    },
    [router]
  );

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 1290,
        margin: 'auto',
        paddingY: '12px',
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Art"
          onClick={handleActionPress('badges')}
          icon={<ArtIcon />}
        />
        <BottomNavigationAction
          label="Locations"
          onClick={handleActionPress('')}
          icon={<LocationIcon />}
        />
        <BottomNavigationAction
          label="Grand Reveal"
          onClick={handleActionPress('art-reveal')}
          icon={<ArtRevealIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
