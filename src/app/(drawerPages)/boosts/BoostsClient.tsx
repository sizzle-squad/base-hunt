'use client';

import React from 'react';
import SwipeUpDrawer from '@/components/Badges/BaseSwipeUpDrawer';
import ListCard, { ListCardProps } from '@/components/ListCard';
import ToolBar from '@/components/drawer/Toolbar';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { useDrawer } from '@/context/DrawerContext';
import { Alert, Box, Button, NoSsr, Snackbar, Stack, SvgIcon } from '@mui/material';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { DrawerType } from '@/context/DrawerContext';
import Text from '@/components/Text';
import { PointsPill } from '@/components/PointsPill';
import { useBoosts } from '@/hooks/useBoosts';
import { useClaimBoost } from '@/hooks/useClaimBoost';
import { GAME_ID } from '@/constants/gameId';
import { useAccount } from 'wagmi';
import { WalletIcon, CoffeeIcon, BagIcon, GridIcon, CircleIcon, LinkIcon, UsersIcon } from '@/components/assets/icons/BoostIcon';

const iconMapping = {
  'WALLET': <WalletIcon />,
  'COFFEE': <CoffeeIcon />,
  'BAG': <BagIcon />,
  'GRID': <GridIcon />,
  'CIRCLE': <CircleIcon />,
  'LINK': <LinkIcon />,
  'USERS': <UsersIcon />
};

type ListCardPropsForBoosts = ListCardProps & {
  points: bigint;
  id: bigint;
  title: string
  description: string;
  type: string;
  contractAddress: string;
  cta: string | null;
  claimed: boolean;
  claimable: boolean;
};

const PageConsts = {
  navTitle: 'Point Boosts' as const,
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
      iconMapping[boost.icon]
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

  const Reason = {
    CLICKAWAY: 'clickaway',
  };

  const handleClose = (event: any, reason: string) => {
    if (reason === Reason.CLICKAWAY) {
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
