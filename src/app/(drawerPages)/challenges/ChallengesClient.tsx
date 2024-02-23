'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  NoSsr,
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
  'icon' | 'challengeType' | 'name'
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
        .filter((challenge) => challenge.displayOrder > 0)
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
            displayOrder: challenge.displayOrder,
            imageUrl: challenge.imageUrl,
          } as ChallengeEntry;
        }) as ChallengeEntry[]) ?? [];

    const challengeList = mapped.filter((challenge) => !challenge.isCompleted);
    challengeList.sort((a, b) => {
      return a.displayOrder - b.displayOrder;
    });
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

  const handleDrawerClose = useCallback(() => {
    setActiveItem(null);
    setHasChallengeCompleteError(false);
    toggleDrawer(PageConsts.drawerType, PageConsts.drawerAnchor, false);
    setIsClaimSuccess(false);
  }, [toggleDrawer]);

  const handleCompletePress = useCallback(
    (item: ListCardPropsForChallenges) => {
      claimChallenge.mutate({
        gameId: GAME_ID,
        userAddress: address,
        challengeId: item!.id.toString(),
        contractAddress: item?.contractAddress,
      });
    },
    // claimBoost should not be in there
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address]
  );

  const handleToggleDrawer = useCallback(
    (item: ListCardPropsForChallenges) => {
      if (item?.isCompleted) return;

      setActiveItem(item);
      handleCompletePress(item);
      toggleDrawer(PageConsts.drawerType, PageConsts.drawerAnchor, true);
    },
    [handleCompletePress, toggleDrawer]
  );

  const handleCTAPress = useCallback((ctaUrl: string) => {
    window.open(ctaUrl, ctaUrl.includes('https://') ? '_blank' : '_self');
  }, []);

  const [isClaimSuccess, setIsClaimSuccess] = useState(false);

  useEffect(() => {
    if (claimChallenge.isSuccess) {
      setIsClaimSuccess(true);
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
        if (isClaimSuccess) {
          return 'Claimed!';
        }

        // Show CTA Text if there is a secondary action
        if (isActive && hasChallengeCompleteError && item.ctaButtonText) {
          return item.ctaButtonText;
        }

        // should not hit this but as a fallback
        return 'Check';
      }, [isActive, item.ctaButtonText]);

      const handleButtonAction = useCallback(() => {
        // trigger follow up CTA if claim has failed
        if (isActive && hasChallengeCompleteError && ctaUrl) {
          handleCTAPress(ctaUrl);
        }

        // dismiss drawer if claim was successful
        handleDrawerClose();
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
            alignItems="flex-start"
            gap={2}
          >
            <Stack gap={1}>
              {!(isActive && hasChallengeCompleteError) && item.title && (
                <Text>{item.description}</Text>
              )}
              {isActive && hasChallengeCompleteError && (
                <Text color="red">
                  Complete the challenge first and then come back to claim your
                  points.
                </Text>
              )}
            </Stack>
            <PointsPill
              points={Number(item.points)}
              unit={PageConsts.drawerSubtitleUnit}
              textColor="#151515"
            />
          </Stack>
          <Button
            variant="contained"
            isLoading={claimChallenge.isLoading}
            onClick={handleButtonAction}
          >
            {ctaButtonText}
          </Button>
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
          {activeItem ? <ChallengeDrawerContent item={activeItem} /> : null}
        </SwipeUpDrawer>
      </NoSsr>
      <BootstrapDialog
        onClose={() => setShowModal(false)}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          How it works
        </DialogTitle>
        <DialogContent>
          <Text gutterBottom lineHeight="160%">
            Base Hunt ends on March 3 at 4 P.M PST. Ensure you’re on the latest
            version of the Coinbase Wallet app for the best playing experience.
          </Text>
          <Text gutterBottom lineHeight="160%" py={1}>
            <b>How do I play?</b>
          </Text>
          <Text gutterBottom lineHeight="160%">
            • On the <b>“Challenges”</b> tab, you can view challenges to
            complete. Each challenge will award points and get you closer to the
            next level. You start at Level 0, and the highest level is Level 4.
          </Text>
          <Text gutterBottom lineHeight="160%">
            • On the <b>“Leaderboard”</b> tab, you can see your rank and join a
            guild to earn more points, have fun, and compete with other guilds.
            If your guild has the most points by 5 P.M MST that day, each guild
            member will receive 100 extra points.
          </Text>
          <Text gutterBottom lineHeight="160%">
            • On the <b>“Prizes”</b> tab, you can redeem prizes as you level up.
            Prizes can be redeemed IRL at ETH Denver or online.
          </Text>
          <Text gutterBottom lineHeight="160%">
            View the full{' '}
            <Link target="_blank" href="https://basehunt.splashthat.com/">
              rules and terms
            </Link>
          </Text>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>
            <Text>Got it!</Text>
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
