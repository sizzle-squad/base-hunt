import { DrawerType, useDrawer } from '@/context/DrawerContext';
import { Global } from '@emotion/react';
import { Box, Button, Stack, Typography } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { format } from 'date-fns';
import { memo } from 'react';

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
      left: 'calc(50% - 15px)',
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
  type: DrawerType;
  title: string;
  description: string;
  mapURL: string;
  labels?: {
    title: string;
    color: string;
  }[];
  owned: boolean;
  completedOn: Date | null;
};

function SwipeUpDrawer({
  type,
  title,
  description,
  labels,
  mapURL,
  owned,
  completedOn,
}: SwipeUpDrawerProps) {
  const { drawerStates, toggleDrawer } = useDrawer();

  return (
    <>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(${owned ? '40%' : '60%'} - ${drawerBleeding}px)`,
            overflow: 'visible',
            backgroundColor: 'var(--sheet-white, rgba(255, 255, 255))',
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
        PaperProps={{
          style: {
            width: '390px',
            left: 'calc(50% - 195px)', // 50% - half of width
          },
        }}
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
            position: 'absolute',
            top: -drawerBleeding,
            visibility: 'visible',
            backgroundColor: 'var(--sheet-white, rgba(255, 255, 255))',
            width: '100%',
          }}
        >
          <Puller />
          <Typography
            sx={{
              fontFamily: 'CoinbaseDisplay',
              fontWeight: 400,
              fontSize: '1.25rem',
            }}
          >
            {title}
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {labels?.map((label) => (
              <Label
                key={label.title}
                title={label.title}
                color={label.color}
              />
            ))}
          </Stack>
          <Typography sx={{}}>{description}</Typography>
          {owned && completedOn && (
            <Typography fontWeight={700}>
              Badge found {format(new Date(completedOn), 'do MMMM yyyy')}
            </Typography>
          )}
          {!owned && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                py: '20px',
                px: 3,
                fontSize: '16px',
                backgroundColor: '#000000',
                width: '100%',
                borderRadius: '12px',
                fontFamily: 'CoinbaseMono',
                fontWeight: 400,
              }}
              href={mapURL}
            >
              View on map
            </Button>
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}

export default SwipeUpDrawer;
