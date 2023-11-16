import { DrawerType, useDrawer } from '@/context/DrawerContext';
import { Global } from '@emotion/react';
import { Box, Typography } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

const drawerBleeding = 56;
const anchor = 'bottom';

const Puller = () => (
  <Box
    sx={{
      width: 48,
      height: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.50)',
      borderRadius: 3,
      position: 'absolute',
      top: -10,
      left: 'calc(50% - 15px)',
    }}
  />
);

type Props = {
  type: DrawerType;
  title: string;
  description: string;
};

function SwipeUpDrawer({ type, title, description }: Props) {
  const { drawerStates, toggleDrawer } = useDrawer();

  return (
    <>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
          '.MuiDrawer-root > .MuiBackdrop-root': {
            backgroundColor: 'transparent',
          },
        }}
      />
      <SwipeableDrawer
        anchor={anchor}
        open={drawerStates.badgeActions[anchor]}
        onClose={() => toggleDrawer(type, anchor, false)}
        onOpen={() => toggleDrawer(type, anchor, true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            backgroundColor: 'var(--sheet-white, rgba(255, 255, 255, 0.90))',
          }}
        >
          <Puller />
          <Typography
            sx={{
              px: '20px',
              py: '24px',
              backgroundColor: 'var(--sheet-white, rgba(255, 255, 255, 0.90))',
              fontFamily: 'CoinbaseDisplay',
              fontWeight: 400,
              fontSize: '1.25rem',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              px: '20px',
              pb: '24px',
            }}
          >
            {description}
          </Typography>
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default SwipeUpDrawer;
