'use client';
import { memo } from 'react';

import { Global } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import { DrawerType } from '@/context/DrawerContext';

const drawerBleeding = 110;
const anchor = 'bottom';

const Puller = memo(() => (
  <Box
    sx={{
      width: 48,
      height: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.50)',
      borderRadius: 3,
      position: 'absolute',
      top: -10,
      transform: 'translateX(-50%)',
      left: '50%',
    }}
  />
));
Puller.displayName = 'Puller';

type LabelProps = {
  title: string;
  color: string;
};

const Label = memo(({ title, color }: LabelProps) => (
  <Box
    sx={{
      padding: '4px 8px',
      backgroundColor: `${color}`,
      width: 'fit-content',
      borderRadius: '100px',
    }}
  >
    <Typography
      sx={{
        fontFamily: 'CoinbaseMono',
        fontSize: '14px',
        fontWeight: 400,
        color: 'var(--Black, #151515)',
        lineHeight: '120%',
      }}
    >
      {title}
    </Typography>
  </Box>
));
Label.displayName = 'Label';

type SwipeUpDrawerProps = {
  toolbarTitle?: string;
  type: DrawerType;
  handleClose: (args?: any) => void;
  open: boolean;
  bleed?: boolean;
  children?: React.ReactNode;
};

function SwipeUpDrawer({
  toolbarTitle,
  type,
  handleClose,
  open,
  bleed = false,
  children,
}: SwipeUpDrawerProps) {
  return (
    <>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            overflow: 'visible',
            paddingBottom: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.90)',
          },
          '.MuiDrawer-root > .MuiBackdrop-root': {},
        }}
      />
      <SwipeableDrawer
        anchor={anchor}
        open={open}
        onClose={handleClose}
        onOpen={handleClose}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            px: '20px',
            pt: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            visibility: 'visible',
            width: '100%',
          }}
        >
          {open && <Puller />}
          {children && children}
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default SwipeUpDrawer;
