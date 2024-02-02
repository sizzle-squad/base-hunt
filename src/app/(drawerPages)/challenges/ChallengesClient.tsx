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
  CardMedia,
  Card,
  Grid,
  Avatar,
  Box,
} from '@mui/material';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { DrawerType } from '@/context/DrawerContext';
import Text from '@/components/Text';
import { PointsPill } from '@/components/PointsPill';
import { useChallenges } from '@/hooks/useChallenges';
import { useCompleteChallenge } from '@/hooks/useCompleteChallenge';
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
import { deepOrange, green } from '@mui/material/colors';

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

type ListCardPropsForChallenges = ListCardProps & {
  id: bigint;
  title: string;
  description: string;
  type: string;
  contractAddresses: string[];
  ctaUrl: string | null;
  ctaText: string | null;
  ctaButtonText: string | null;
  points: bigint;
  isCompleted: boolean;
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

const CompletedSvg = memo(() => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 1.1547C15.2376 0.440169 16.7624 0.440169 18 1.1547L27.8564 6.8453C29.094 7.55983 29.8564 8.88034 29.8564 10.3094V21.6906C29.8564 23.1197 29.094 24.4402 27.8564 25.1547L18 30.8453C16.7624 31.5598 15.2376 31.5598 14 30.8453L4.14359 25.1547C2.90599 24.4402 2.14359 23.1197 2.14359 21.6906V10.3094C2.14359 8.88034 2.90599 7.55983 4.14359 6.8453L14 1.1547Z"
      fill="white"
    />
    <path
      d="M15 8.57735C15.6188 8.22008 16.3812 8.22008 17 8.57735L21.9282 11.4226C22.547 11.7799 22.9282 12.4402 22.9282 13.1547V18.8453C22.9282 19.5598 22.547 20.2201 21.9282 20.5774L17 23.4226C16.3812 23.7799 15.6188 23.7799 15 23.4226L10.0718 20.5774C9.45299 20.2201 9.0718 19.5598 9.0718 18.8453V13.1547C9.0718 12.4402 9.45299 11.7799 10.0718 11.4226L15 8.57735Z"
      fill="#1D1818"
    />
    <path
      d="M13 17.5L15.2857 19L19 13"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
));

const IncompleteSvg = memo(() => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 1.1547C15.2376 0.440169 16.7624 0.440169 18 1.1547L27.8564 6.8453C29.094 7.55983 29.8564 8.88034 29.8564 10.3094V21.6906C29.8564 23.1197 29.094 24.4402 27.8564 25.1547L18 30.8453C16.7624 31.5598 15.2376 31.5598 14 30.8453L4.14359 25.1547C2.90599 24.4402 2.14359 23.1197 2.14359 21.6906V10.3094C2.14359 8.88034 2.90599 7.55983 4.14359 6.8453L14 1.1547Z"
      fill="white"
    />
    <path
      d="M15 8.57735C15.6188 8.22008 16.3812 8.22008 17 8.57735L21.9282 11.4226C22.547 11.7799 22.9282 12.4402 22.9282 13.1547V18.8453C22.9282 19.5598 22.547 20.2201 21.9282 20.5774L17 23.4226C16.3812 23.7799 15.6188 23.7799 15 23.4226L10.0718 20.5774C9.45299 20.2201 9.0718 19.5598 9.0718 18.8453V13.1547C9.0718 12.4402 9.45299 11.7799 10.0718 11.4226L15 8.57735Z"
      fill="black"
    />
    <path d="M13 13L19 19" stroke="white" strokeWidth="1.5" />
    <path d="M13 19L19 13" stroke="white" strokeWidth="1.5" />
  </svg>
));

IncompleteSvg.displayName = 'IncompleteSvg';
CompletedSvg.displayName = 'CompletedSvg';

export default function ChallengesPageClient() {
  const { address } = useAccount();
  const loadingCollection = useMemo(() => [null, null, null, null], []);
  const { data: boosts, isLoading } = useChallenges({
    userAddress: address,
    gameId: GAME_ID,
  });
  const { claimBoost } = useCompleteChallenge();

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

  const [activeItem, setActiveItem] =
    useState<ListCardPropsForChallenges | null>(null);
  const [eligibleItem, setEligibleItem] =
    useState<ListCardPropsForChallenges | null>(null);

  const { drawerStates, toggleDrawer } = useDrawer();

  const isOpen = useMemo(
    () => Boolean(drawerStates.boostsAction[PageConsts.drawerAnchor]),
    [drawerStates.boostsAction]
  );

  const handleToggleDrawer = useCallback(
    (item: ListCardPropsForChallenges) => {
      setActiveItem(item);
      toggleDrawer(PageConsts.drawerType, PageConsts.drawerAnchor, !isOpen);
    },
    [isOpen, toggleDrawer]
  );

  const handleClaimPress = useCallback(() => {
    claimBoost.mutate({
      gameId: GAME_ID,
      userAddress: address,
      challengeId: activeItem!.id.toString(),
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
      item: ListCardPropsForChallenges;
      onClick: (item: ListCardPropsForChallenges) => void;
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
      onClick: (item: ListCardPropsForChallenges) => void;
      item: ListCardPropsForChallenges;
    }) => <ToolBar title={title} onDismiss={() => onClick(item)} />
  );

  ToggleDrawerButton.displayName = 'ToggleDrawerButton';
  ToolbarWithClose.displayName = 'ToolbarWithClose';

  const BoostDrawerContent = ({
    item,
  }: {
    item: ListCardPropsForChallenges;
  }) => {
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
              boostList?.map((item, index) => {
                const bgColor =
                  item.type.charAt(0) === 'T' ? deepOrange[500] : green[500];
                return (
                  <Grid item key={index}>
                    <Card
                      sx={{
                        width: '300px',
                        height: '100%',
                        p: 2,
                        borderRadius: '8px',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                        }}
                      >
                        {item.claimed ? <CompletedSvg /> : <IncompleteSvg />}
                      </Box>
                      <CardContent sx={{ position: 'relative' }}>
                        <Stack
                          direction="row"
                          gap={2}
                          justifyContent="space-between"
                        >
                          <Stack direction={'column'} height={100} py={1}>
                            <Text variant="h6">{item.title}</Text>
                            <Text>{item.points.toString() + ' pts'}</Text>
                          </Stack>
                          <Avatar
                            sx={{
                              bgcolor: bgColor,
                              height: '50px',
                              width: '50px',
                            }}
                          >
                            {item.type.charAt(0)}
                          </Avatar>
                        </Stack>
                      </CardContent>
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
                          cta={item.ctaText ?? 'Claim Points'}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
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
