import { DrawerType, useDrawer } from '@/context/DrawerContext';
import { Global } from '@emotion/react';
import { Box, Stack } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { format } from 'date-fns';
import { memo, useCallback, useMemo, useState } from 'react';
import Text from '@/components/Text';
import { BadgeLocationMap } from '../Map/BadgeLocationMap';
import ToolBar from '../drawer/Toolbar';
import { Button } from '@/components/assets/Button';
import Link from '@/components/AnimatedLink';
import { useMobileCheck } from '@/context/MobileContext';
import { BadgeTypeEnum } from '@/hooks/types';

const drawerBleeding = 110;
const anchor = 'bottom';

const googleMapNavigationUrl = `https://www.google.com/maps/dir/?api=1`;

function getNavigationUrl(latLng: string) {
  return `${googleMapNavigationUrl}&destination=${latLng}&dir_action=navigate`;
}

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
    <Text
      sx={{
        fontFamily: 'CoinbaseMono',
        fontSize: '14px',
        fontWeight: 400,
        color: 'var(--Black, #151515)',
        lineHeight: '120%',
      }}
    >
      {title}
    </Text>
  </Box>
));
Label.displayName = 'Label';

type SwipeUpDrawerProps = {
  type: DrawerType;
  title: string;
  description: string;
  owned: boolean;
  completedOn: Date | null;
  latLng: string;
  badgeType: BadgeTypeEnum;
  ctaLink?: string;
  artistName?: string;
};

function SwipeUpDrawer({
  type,
  title,
  description,
  owned,
  completedOn,
  latLng,
  badgeType,
  ctaLink,
  artistName,
}: SwipeUpDrawerProps) {
  const { drawerStates, toggleDrawer } = useDrawer();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const isMobile = useMobileCheck();

  const handleViewOnMapPress = useCallback(() => {
    setIsMapOpen(true);
  }, []);

  const ctaButton = useMemo(() => {
    if (owned) return null;

    if (badgeType === BadgeTypeEnum.IRL) {
      return (
        <Button variant="contained" onClick={handleViewOnMapPress}>
          View on map
        </Button>
      );
    } else if (badgeType === BadgeTypeEnum.Online) {
      return (
        <Button variant="contained" href={ctaLink}>
          Mint
        </Button>
      );
    }
  }, [badgeType, ctaLink, handleViewOnMapPress, owned]);

  const content = useMemo(() => {
    if (isMapOpen) {
      const [lat, lng] = latLng.split(',').map((coord) => parseFloat(coord));

      return (
        <>
          <ToolBar title={title} onDismiss={() => setIsMapOpen(false)} />
          <BadgeLocationMap
            height="350px"
            width="100%"
            lat={lat}
            lng={lng}
            roundedBorder
          />
          {isMobile ? (
            <Link href={getNavigationUrl(latLng)}>
              <Button variant="contained">Get direction</Button>
            </Link>
          ) : (
            <Button variant="contained" disabled>
              Get direction
            </Button>
          )}
        </>
      );
    }

    return (
      <Stack direction="column" gap={3}>
        <Stack direction="column" gap={1}>
          <Text fontWeight={400} fontSize="24px">
            {title}
          </Text>
          {artistName && <Text fontWeight={400}>{artistName}</Text>}
        </Stack>
        <Text>{description}</Text>
        {owned && completedOn && (
          <Text fontWeight={700}>
            Badge found {format(new Date(completedOn), 'do MMMM yyyy')}
          </Text>
        )}
        {ctaButton}
      </Stack>
    );
  }, [
    artistName,
    completedOn,
    ctaButton,
    description,
    isMapOpen,
    isMobile,
    latLng,
    owned,
    title,
  ]);

  return (
    <>
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: isMapOpen ? '500px' : '200px',
            overflow: 'visible',
            backgroundColor: 'var(--sheet-white, rgba(255, 255, 255))',
          },
          '.MuiDrawer-root > .MuiBackdrop-root': {
            backgroundColor: 'transparent',
          },
        }}
      />
      <Box
        onClick={() =>
          toggleDrawer(type, anchor, !drawerStates.badgeActions[anchor])
        }
      >
        <SwipeableDrawer
          allowSwipeInChildren
          anchor={anchor}
          open={drawerStates.badgeActions[anchor]}
          onClose={() => toggleDrawer(type, anchor, false)}
          onOpen={() => toggleDrawer(type, anchor, true)}
          swipeAreaWidth={100}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Stack
            direction="column"
            gap="16px"
            width="100%"
            height="100%"
            sx={{
              px: '20px',
              py: '24px',
              position: 'absolute',
              top: isMapOpen ? 0 : -drawerBleeding,
              visibility: 'visible',
              backgroundColor: 'var(--sheet-white, rgba(255, 255, 255))',
            }}
          >
            <Puller />
            {content}
          </Stack>
        </SwipeableDrawer>
      </Box>
    </>
  );
}

export default SwipeUpDrawer;
