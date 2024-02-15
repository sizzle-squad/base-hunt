'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  NoSsr,
  Snackbar,
  Stack,
} from '@mui/material';
import { useAccount } from 'wagmi';
import { BootstrapDialog } from '@/components/BoostrapDialog';

import { Button } from '@/components/assets/Button';
import SwipeUpDrawer from '@/components/Badges/BaseSwipeUpDrawer';
import ToolBar from '@/components/drawer/Toolbar';
import { ListCardProps } from '@/components/ListCard';
import { PointsPill } from '@/components/PointsPill';
import Text from '@/components/Text';
import { GAME_ID } from '@/constants/gameId';
import { useDrawer } from '@/context/DrawerContext';
import { DrawerType } from '@/context/DrawerContext';
import { Challenge, ChallengeTypeEnum } from '@/hooks/types';
import { useChallenges } from '@/hooks/useChallenges';
import { useCompleteChallenge } from '@/hooks/useCompleteChallenge';
import { useGameInfoContext } from '@/context/GameInfoContext';
import { ChallengeList } from './ChallengeList';

export type ChallengeEntry = Omit<
  Challenge,
  'icon' | 'imageUrl' | 'challengeType' | 'name'
> & {
  title: string;
};

type ListCardPropsForChallenges = ListCardProps & {
  id: number;
  title: string;
  description: string;
  type: string;
  contractAddress: string | null;
  ctaUrl: string | null;
  ctaText: string | null;
  ctaButtonText: string | null;
  points: number;
  isCompleted?: boolean;
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

type ClientChallengeType = 'Social' | 'Trivia' | 'NFT' | 'OnBase';

const Reason = {
  CLICKAWAY: 'clickaway',
};

function mapChallengeType(type: ChallengeTypeEnum): ClientChallengeType {
  switch (type) {
    case 'GUILD':
    case 'SOCIAL':
      return 'Social';
    case 'TRIVIA':
      return 'Trivia';
    case 'EVENT_TYPE_TRANSFER_ERC721':
    case 'EVENT_TYPE_TRANSFER_ERC1155':
      return 'NFT';
    case 'CONTRACT_INTERACTION':
    case 'BALANCE_CHECK':
    case 'EVENT_TYPE_CONTRACT_EXECUTION':
    case 'ERC_TRANSFER':
      return 'OnBase';
    default:
      throw new Error(`Unknown challenge type: ${type}`);
  }
}

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
ToolbarWithClose.displayName = 'ToolbarWithClose';

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
ToggleDrawerButton.displayName = 'ToggleDrawerButton';

export default function ChallengesPageClient() {
  const { address } = useAccount();
  const { showModal, setShowModal } = useGameInfoContext();

  const { data: challenges, isLoading: isChallengesLoading } = useChallenges({
    userAddress: address,
    gameId: GAME_ID,
  });
  const { claimChallenge } = useCompleteChallenge();

  const listData = useMemo(() => {
    const mapped =
      (challenges
        ?.filter((challenge) => challenge.isEnabled)
        .map((challenge) => {
          return {
            id: challenge.id,
            title: challenge.name,
            description: challenge.description,
            type: mapChallengeType(
              challenge.challengeType as ChallengeTypeEnum
            ),
            contractAddress: challenge.contractAddress,
            subtitle: '',
            ctaUrl: challenge.ctaUrl,
            ctaText: challenge.ctaText,
            ctaButtonText: challenge.ctaButtonText,
            points: challenge.points,
            isCompleted: challenge.isCompleted,
            isEnabled: challenge.isEnabled,
            gameId: challenge.gameId,
            checkFunction: challenge.checkFunction,
          } as ChallengeEntry;
        }) as ChallengeEntry[]) ?? [];

    const challengeList = mapped.filter((challenge) => !challenge.isCompleted);
    const completedList = mapped.filter((challenge) => challenge.isCompleted);

    return { challengeList, completedList };
  }, [challenges]);

  const [activeItem, setActiveItem] =
    useState<ListCardPropsForChallenges | null>(null);
  const [hasChallengeCompleteError, setHasChallengeCompleteError] =
    useState(false);

  const { drawerStates, toggleDrawer } = useDrawer();

  const isOpen = useMemo(
    () => Boolean(drawerStates.boostsAction[PageConsts.drawerAnchor]),
    [drawerStates.boostsAction]
  );

  const handleToggleDrawer = useCallback(
    (item: ListCardPropsForChallenges | null) => {
      if (item?.isCompleted) return;
      setActiveItem(item);
      toggleDrawer(PageConsts.drawerType, PageConsts.drawerAnchor, !isOpen);
    },
    [isOpen, toggleDrawer]
  );

  const handleDrawerClose = useCallback(() => {
    handleToggleDrawer(null);
    setHasChallengeCompleteError(false);
  }, [handleToggleDrawer]);

  const handleCompletePress = useCallback(() => {
    claimChallenge.mutate({
      gameId: GAME_ID,
      userAddress: address,
      challengeId: activeItem!.id.toString(),
      contractAddress: activeItem?.contractAddress,
    });

    // claimBoost should not be in there
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, activeItem]);

  const handleCTAPress = useCallback((ctaUrl: string) => {
    window.open(ctaUrl, '_blank');
  }, []);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClose = useCallback((_: any, reason: string) => {
    if (reason === Reason.CLICKAWAY) {
      return;
    }
    setSnackbarOpen(false);
  }, []);

  useEffect(() => {
    if (claimChallenge.isSuccess) {
      setSnackbarMessage('Points claimed.');
      setSnackbarOpen(true);
      handleToggleDrawer(activeItem!);
    }

    if (claimChallenge.isError) {
      setHasChallengeCompleteError(true);
    }
    // activeItem and handleToggleDrawer should not be in there
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimChallenge.isSuccess, claimChallenge.isError]);

  const ChallengeDrawerContent = memo(
    ({ item }: { item: ListCardPropsForChallenges }) => {
      const isActive = activeItem && activeItem.id === item.id;
      const ctaUrl = item.ctaUrl;

      const ctaButtonText = useMemo(() => {
        // Show CTA Text if there is a secondary action
        if (isActive && hasChallengeCompleteError && item.ctaButtonText) {
          return item.ctaButtonText;
        }

        return 'Claim Points';
      }, [isActive, item.ctaButtonText]);

      const handleButtonAction = useCallback(() => {
        // trigger follow up CTA if claim has failed
        if (isActive && hasChallengeCompleteError && ctaUrl) {
          handleCTAPress(ctaUrl);
        } else {
          handleCompletePress();
        }
      }, [ctaUrl, isActive]);

      return (
        <Stack gap={3}>
          <ToolbarWithClose
            item={item}
            onClick={handleDrawerClose}
            title={item.title}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Stack gap={1}>
              {!(isActive && hasChallengeCompleteError) && item.title && (
                <Text>{item.description}</Text>
              )}
              {isActive && hasChallengeCompleteError && (
                <Text color="red">
                  You are not eligible to complete this challenge.
                </Text>
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
                (isActive && ctaButtonText === 'Check claim') ||
                claimChallenge.isLoading
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
                (isActive && ctaButtonText === 'Check claim') ||
                claimChallenge.isLoading
              }
              onClick={handleButtonAction}
            >
              {ctaButtonText}
            </Button>
          )}
        </Stack>
      );
    }
  );

  ChallengeDrawerContent.displayName = 'ChallengeDrawerContent';

  return (
    <>
      <NoSsr>
        <ChallengeList
          sectionTitle="Challenges"
          list={listData.challengeList}
          onClick={handleToggleDrawer}
          isLoading={isChallengesLoading}
          displayGuildChallenge
        />
        <ChallengeList
          sectionTitle="Completed"
          list={listData.completedList}
          isLoading={isChallengesLoading}
        />
        <SwipeUpDrawer
          toolbarTitle={PageConsts.drawerTitle}
          type={PageConsts.drawerType}
          handleClose={handleDrawerClose}
          open={isOpen}
        >
          {activeItem && <ChallengeDrawerContent item={activeItem} />}
        </SwipeUpDrawer>
      </NoSsr>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={snackbarMessage}
      />
      <BootstrapDialog
        onClose={() => setShowModal(false)}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          How to it works
        </DialogTitle>
        <DialogContent>
          <Text gutterBottom>
            1. Complete challenges to get points and level up.
          </Text>
          <Text gutterBottom>
            2. Join guild to play with friends and to win guild specific prizes.
          </Text>
          <Text gutterBottom>
            3. Each level unlocks new merch and other prizes.
          </Text>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>
            <Text>Ok!</Text>
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
