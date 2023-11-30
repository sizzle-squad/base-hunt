'use client';

import SwipeUpDrawer from '@/components/Badges/BaseSwipeUpDrawer';
import ListCard, { ListCardProps } from '@/components/ListCard';
import ToolBar from '@/components/drawer/Toolbar';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { useDrawer } from '@/context/DrawerContext';
import { Alert, Box, Button, NoSsr, Snackbar, Stack } from '@mui/material';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { DrawerType } from '@/context/DrawerContext';
import Text from '@/components/Text';
import { PointsPill } from '@/components/Pill';
import { useBoosts } from '@/hooks/useBoosts';
import { useClaimBoost } from '@/hooks/useClaimBoost';
import { GAME_ID } from '@/constants/gameId';
import { useAccount } from 'wagmi';

type ListCardPropsForBoosts = ListCardProps & {
  explanation?: string;
  points: number;
  id: string;
  description: string;
  contractAddress: string;
  cta: string;
  claimed: boolean;
  claimable: boolean;
  completed: {
    times: number;
    maxTimes: number;
  };
};

const PageConsts = {
  navTitle: 'Point Boost' as const,
  drawerTitle: 'Boosts' as const,
  drawerSubtitle: 'Completed 3 times' as const,
  drawerSubtitlePoints: 100000 as const,
  drawerSubtitleUnit: 'pts' as const,
  drawerButtonText: 'Visit merch store' as const,
  drawerType: 'boostsAction' as DrawerType,
  drawerAnchor: 'bottom' as const,
} as const;

export default function BoostsPageClient() {

  const { address } = useAccount();
  const { data: boosts, isLoading } = useBoosts({userAddress: address, gameId: GAME_ID});
  const { claimBoost } = useClaimBoost();

  const boostsCollection = boosts?.filter((boost) => boost.isEnabled).map((boost) => { return {
    id: boost.id,
    title: boost.name,
    description: boost.description,
    type: boost.boostType,
    contractAddress: boost.contractAddresses[0],
    subtitle: '',
    cta: boost.ctaText,
    points: boost.points,
    claimed: boost.claimed,
    claimable: !boost.claimed,
    startContent: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 11V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V10.9673M10.4 21H13.6C15.8402 21 16.9603 21 17.816 20.564C18.5686 20.1805 19.1805 19.5686 19.564 18.816C20 17.9603 20 16.8402 20 14.6V12.2C20 11.0799 20 10.5198 19.782 10.092C19.5903 9.71569 19.2843 9.40973 18.908 9.21799C18.4802 9 17.9201 9 16.8 9H7.2C6.0799 9 5.51984 9 5.09202 9.21799C4.71569 9.40973 4.40973 9.71569 4.21799 10.092C4 10.5198 4 11.0799 4 12.2V14.6C4 16.8402 4 17.9603 4.43597 18.816C4.81947 19.5686 5.43139 20.1805 6.18404 20.564C7.03968 21 8.15979 21 10.4 21Z"
          stroke="#131A29"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    endContent: <Text>{boost.points.toString()} pts</Text>,
  }});

  const [activeItem, setActiveItem] = useState<ListCardPropsForBoosts | null>(
    null
  );

  const { drawerStates, toggleDrawer } = useDrawer();

  const isOpen = useMemo(
    () => Boolean(drawerStates.boostsAction[PageConsts.drawerAnchor]),
    [drawerStates.boostsAction]
  );

  const handleToggleDrawer = useCallback(
    (item: ListCardPropsForBoosts) => {
      setActiveItem(item);
      toggleDrawer(PageConsts.drawerType, PageConsts.drawerAnchor, !isOpen);
    },
    [isOpen, toggleDrawer]
  );

  const handleCTAPress = useCallback(() => {
    claimBoost.mutate({
      gameId: GAME_ID,
      userAddress: address,
      boostId: activeItem!.id,
      contractAddress: activeItem?.contractAddress
    });
  }, [GAME_ID, address, activeItem]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClose = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (claimBoost.isSuccess) {
      setSnackbarMessage("Boost was successfully claimed.");
      setSnackbarOpen(true);
    }
    if (claimBoost.isError) {
      setSnackbarMessage("Unable to claim boost.");
      setSnackbarOpen(true);
    }
  }, [claimBoost.isSuccess, claimBoost.isError]);

  const ToggleDrawerButton = memo(
    ({
      item,
      onClick,
    }: {
      item: ListCardPropsForBoosts;
      onClick: (item: ListCardPropsForBoosts) => void;
    }) => <Box sx={{
      color: 'blue',
    }} onClick={() => onClick(item)}>{'Claim Boost'}</Box>
  );

  const ToolbarWithClose = memo(
    ({
      title,
      onClick,
      item,
    }: {
      title: string;
      onClick: (item: ListCardPropsForBoosts) => void;
      item: ListCardPropsForBoosts;
    }) => <ToolBar title={title} onDismiss={() => onClick(item)} />
  );

  ToggleDrawerButton.displayName = 'ToggleDrawerButton';
  ToolbarWithClose.displayName = 'ToolbarWithClose';

  const BoostDrawerContent = ({ item }: { item: ListCardPropsForBoosts }) => (
    <Stack gap="24px">
      <ToolbarWithClose
        item={item}
        onClick={handleToggleDrawer}
        title={PageConsts.drawerTitle}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack gap="8px">
          {item.title && (
            <>
              <Text variant="h4">{item.title}</Text>
              <Text>{item.description}</Text>
              {item?.explanation && (
                <Text fontSize="14px">{item?.explanation}</Text>
              )}
            </>
          )}
        </Stack>
        <PointsPill points={item.points} unit={PageConsts.drawerSubtitleUnit} />
      </Stack>

      <Button
        variant="contained"
        color="primary"
        sx={{
          py: 2,
          px: 3,
          borderRadius: 2,
          bgcolor: 'black',
          color: 'white',
        }}
        disabled={claimBoost.isLoading}
        onClick={handleCTAPress}
      >
        { item.claimable ? 'Claim boost' : item.cta }
      </Button>
    </Stack>
  );

  return (
    <>
      <DetailsPageNavbar title={PageConsts.navTitle} />
      <NoSsr>
        <Stack gap={2}>
          {boostsCollection?.map((item, index) => (
            <ListCard
              key={index}
              title={item.title}
              subtitle={item.claimed ? (item.type === 'TRANSFER_NFT' ? 'Auto-claimed' : 'Claimed') : <ToggleDrawerButton item={item} onClick={handleToggleDrawer} />}
              startContent={item.startContent}
              endContent={item.endContent}
            />
          ))}
        </Stack>
        <SwipeUpDrawer
          toolbarTitle={PageConsts.drawerTitle}
          type={PageConsts.drawerType}
          handleClose={handleToggleDrawer}
          open={isOpen}
        >
          {activeItem && <BoostDrawerContent item={activeItem} />}
        </SwipeUpDrawer>
      </NoSsr>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={snackbarMessage}
        />
    </>
  );
}
