'use client';
import { DrawerType } from '@/context/DrawerContext';
import { Global } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { memo } from 'react';

const drawerBleeding = 110;
const anchor = 'bottom';

const Puller = memo(() => <></>);
Puller.displayName = 'Puller';

type LabelProps = {
  title: string;
  color: string;
};

const Label = memo(({ title, color }: LabelProps) => <></>);
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
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      ></SwipeableDrawer>
    </>
  );
}

export default SwipeUpDrawer;
