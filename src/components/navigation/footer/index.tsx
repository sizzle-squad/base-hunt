'use client';

import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArtIcon } from '@/components/assets/icons/ArtIcon';
import { LocationIcon } from '@/components/assets/icons/LocationIcon';
import { ArtRevealIcon } from '@/components/assets/icons/ArtRevealIcon';
import Link from 'next/link';

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
      >
        <BottomNavigationAction
          label="Art"
          value="/badges"
          icon={<ArtIcon color={value === '/badges' ? '#E1FF67' : 'none'} />}
        />
        <BottomNavigationAction
          label="Locations"
          value="/locations"
          icon={
            <LocationIcon
              color={value === '/locations' ? '#E1FF67' : '#1D1818'}
            />
          }
        />
        <BottomNavigationAction
          label="Grand Reveal"
          value="/art-reveal"
          icon={
            <ArtRevealIcon
              color={value === '/art-reveal' ? '#E1FF67' : '#1D1818'}
            />
          }
        />
      </BottomNavigation>
    </Paper>
  );
}
