'use client';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import MapIcon from '@mui/icons-material/Map';
import NfcIcon from '@mui/icons-material/Nfc';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
  const [value, setValue] = useState(0);

  const handleActionPress = useCallback((route: string) => {
    return () => router.push(`/${route}/`);
  }, []);

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
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
          label="Badges"
          onClick={handleActionPress('badges')}
          icon={<VerifiedIcon />}
        />
        <BottomNavigationAction
          label="Locations"
          onClick={handleActionPress('')}
          icon={<MapIcon />}
        />
        <BottomNavigationAction
          label="Treasure Box"
          onClick={handleActionPress('treasure-box')}
          icon={<NfcIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
