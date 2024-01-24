'use client';

import React from 'react';
import SwipeUpDrawer from '@/components/Badges/BaseSwipeUpDrawer';
import ListCard, { ListCardProps } from '@/components/ListCard';
import ToolBar from '@/components/drawer/Toolbar';
import { useDrawer } from '@/context/DrawerContext';
import {
  NoSsr,
  Snackbar,
  Stack,
  Link,
  CardContent,
  CardHeader,
  CardMedia,
  Card,
  Grid,
} from '@mui/material';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { DrawerType } from '@/context/DrawerContext';
import Text from '@/components/Text';
import { PointsPill } from '@/components/PointsPill';
import { useBoosts } from '@/hooks/useBoosts';
import { useClaimBoost } from '@/hooks/useClaimBoost';
import { GAME_ID } from '@/constants/gameId';
import { useAccount } from 'wagmi';
import { Button } from '@/components/assets/Button';

import {
  WalletIcon,
  CoffeeIcon,
  BagIcon,
  GridIcon,
  CircleIcon,
  LinkIcon,
  UsersIcon,
} from '@/components/assets/icons/BoostIcon';

const satoshissecretLink =
  'https://go.cb-w.com/messaging?address=0x25D5eE3851a1016AfaB42798d8Ba3658323e6498&messagePrompt=gm';

const iconMapping = {
  WALLET: <WalletIcon />,
  COFFEE: <CoffeeIcon />,
  BAG: <BagIcon />,
  GRID: <GridIcon />,
  CIRCLE: <CircleIcon />,
  LINK: <LinkIcon />,
  USERS: <UsersIcon />,
};

type BoostEntry = {
  id: bigint;
  title: string;
  description: string;
  type: string;
  contractAddresses: string[];
  subtitle: string;
  ctaUrl: string | null;
  ctaText: string | null;
  ctaButtonText: string | null;
  points: bigint;
  claimed: boolean;
  claimable: boolean;
  startContent: React.JSX.Element;
  endContent: React.JSX.Element;
};

type ListCardPropsForBoosts = ListCardProps & {
  id: bigint;
  title: string;
  description: string;
  type: string;
  contractAddresses: string[];
  ctaUrl: string | null;
  ctaText: string | null;
  ctaButtonText: string | null;
  points: bigint;
  claimed: boolean;
  claimable: boolean;
};

const PageConsts = {
  navTitle: 'Get more points & get more merch' as const,
  drawerTitle: 'Points' as const,
  drawerSubtitle: 'Completed 3 times' as const,
  drawerSubtitlePoints: 100000 as const,
  drawerSubtitleUnit: 'pts' as const,
  drawerButtonText: 'Visit merch store' as const,
  drawerType: 'boostsAction' as DrawerType,
  drawerAnchor: 'bottom' as const,
} as const;

export default function ChallengePageClient() {
  const { address } = useAccount();
  const loadingCollection = useMemo(() => [null, null, null, null], []);
  const { data: boosts, isLoading } = useBoosts({
    userAddress: address,
    gameId: GAME_ID,
  });
  const { claimBoost } = useClaimBoost();

  const boostList = useMemo(() => {
    return boosts
      ?.filter((boost) => boost.isEnabled)
      .map((boost) => {
        return {
          id: boost.id,
          title: boost.name,
          description: boost.description,
          type: boost.boostType,
          contractAddresses: boost.contractAddresses,
          subtitle: '',
          ctaUrl: boost.ctaUrl,
          ctaText: boost.ctaText,
          ctaButtonText: boost.ctaButtonText,
          points: boost.points,
          claimed: boost.claimed,
          claimable: !boost.claimed,
          startContent: iconMapping[boost.icon],
          endContent: <Text>{boost.points.toString()} pts</Text>,
        } as BoostEntry;
      }) as BoostEntry[];
  }, [boosts]);

  const [activeItem, setActiveItem] = useState<ListCardPropsForBoosts | null>(
    null
  );
  const [eligibleItem, setEligibleItem] =
    useState<ListCardPropsForBoosts | null>(null);

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

  const handleClaimPress = useCallback(() => {
    claimBoost.mutate({
      gameId: GAME_ID,
      userAddress: address,
      boostId: activeItem!.id.toString(),
      contractAddresses: activeItem?.contractAddresses,
    });
    // claimBoost should not be in there
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, activeItem]);

  const handleCTAPress = (ctaUrl: string) => {
    window.open(ctaUrl, '_blank');
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      setSnackbarMessage('Points claimed.');
      setSnackbarOpen(true);
      handleToggleDrawer(activeItem!);
    }
    if (claimBoost.isError) {
      setEligibleItem(activeItem);
    }
    // activeItem and handleToggleDrawer should not be in there
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimBoost.isSuccess, claimBoost.isError]);

  const ToggleDrawerButton = memo(
    ({
      item,
      onClick,
      cta = 'Claim Points',
    }: {
      item: ListCardPropsForBoosts;
      onClick: (item: ListCardPropsForBoosts) => void;
      cta?: string;
    }) => <Button onClick={() => onClick(item)}>{cta}</Button>
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

  const BoostDrawerContent = ({ item }: { item: ListCardPropsForBoosts }) => {
    const isEligible = eligibleItem && eligibleItem.id === item.id;
    const ctaText =
      isEligible && item.ctaText ? item.ctaText : 'Unable to claim this boost.';
    const ctaButtonText =
      isEligible && item.ctaButtonText ? item.ctaButtonText : 'Claim Points';
    const ctaUrl = item.ctaUrl;

    const handleButtonAction = () => {
      if (item.type === 'SOCIAL') {
        handleClaimPress();
      } else if (isEligible && ctaUrl) {
        handleCTAPress(ctaUrl);
      } else {
        handleClaimPress();
      }
    };

    return (
      <Stack gap="24px">
        <ToolbarWithClose
          item={item}
          onClick={handleToggleDrawer}
          title={PageConsts.drawerTitle}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack gap="8px">
            {!(isEligible && ctaText) && item.title && (
              <>
                <Text variant="h4">{item.title}</Text>
                <Text>
                  {item.description}{' '}
                  {item.title.indexOf('Secret') > -1 && (
                    <Link
                      href={satoshissecretLink}
                      target="_blank"
                      underline="none"
                    >
                      here
                    </Link>
                  )}
                </Text>
              </>
            )}
            {isEligible && ctaText && (
              <>
                <Text variant="h4">{item.title}</Text>
                <Text color="red">
                  You are not eligible to claim this boost.
                </Text>
                <Text>{ctaText}</Text>
              </>
            )}
          </Stack>
          <PointsPill
            points={Number(item.points)}
            unit={PageConsts.drawerSubtitleUnit}
            textColor="#151515"
          />
        </Stack>
        {item.type === 'SOCIAL' ? (
          <Button
            variant="contained"
            disabled={
              (isEligible && ctaButtonText === 'Check claim') ||
              claimBoost.isLoading
            }
          >
            <a
              href={item.type === 'SOCIAL' ? item.ctaUrl ?? '' : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleButtonAction}
              style={{
                textDecoration: 'none',
                color: 'white',
              }}
            >
              {ctaButtonText}
            </a>
          </Button>
        ) : (
          <Button
            variant="contained"
            disabled={
              (isEligible && ctaButtonText === 'Check claim') ||
              claimBoost.isLoading
            }
            onClick={handleButtonAction}
          >
            {ctaButtonText}
          </Button>
        )}
      </Stack>
    );
  };

  return (
    <>
      <NoSsr>
        <Stack gap={2} alignItems="center">
          {isLoading &&
            loadingCollection.map((_, index) => (
              <ListCard key={index} isLoading={isLoading} />
            ))}
          <Grid container spacing={3} sx={{ width: '100%' }}>
            {boostList &&
              boostList?.map((item, index) => (
                <Grid item key={index}>
                  <Card
                    sx={{
                      width: '300px',
                      height: '100%',
                      p: 2,
                      borderRadius: '8px',
                    }}
                  >
                    <CardHeader
                      sx={{ height: '100px', fontSize: '16px', p: 0 }}
                      title={<Text variant="h6">{item.title}</Text>}
                      subheader={<Text>{item.points.toString() + ' pts'}</Text>}
                      disableTypography
                      avatar={item.startContent}
                    />
                    <CardMedia
                      component="img"
                      height="300"
                      image="https://go.wallet.coinbase.com/static/base-hunt/base-house.jpg"
                      alt="green iguana"
                    />
                    <CardContent>
                      <ToggleDrawerButton
                        item={item}
                        onClick={handleToggleDrawer}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
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
