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
import { useIsBetaTesters } from '@/hooks/useIsBetaTester';
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

type Props = {
  refreshData: () => void;
};

export default function ChallengesPageClient({ refreshData }: Props) {
  const { address } = useAccount();
  const { showModal, setShowModal } = useGameInfoContext();
  const isBetaTester = useIsBetaTesters({ address });

  const { data: challenges, isLoading: isChallengesLoading } = useChallenges({
    userAddress: address,
    gameId: GAME_ID,
  });
  const { claimChallenge } = useCompleteChallenge();

  const listData = useMemo(() => {
    return { challengeList: [], completedList: [] };
  }, []);

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
      // do not mutate for joining guild challenge
      if (item.id === 10) return;

      claimChallenge.mutate(
        {
          gameId: GAME_ID,
          userAddress: address,
          challengeId: item!.id.toString(),
          contractAddress: item?.contractAddress,
        },
        {
          onSuccess: () => {
            refreshData();
          },
        }
      );
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

      // refetch points
      refreshData();
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
      const isJoinGuildChallenge = item.id === 10;

      const ctaButtonText = useMemo(() => {
        if (isClaimSuccess) {
          return 'Claimed!';
        }

        // Show CTA Text if there is a secondary action
        if (
          isActive &&
          (hasChallengeCompleteError || isJoinGuildChallenge) &&
          item.ctaButtonText
        ) {
          return item.ctaButtonText;
        }

        // should not hit this but as a fallback
        return 'Check';
      }, [isActive, isJoinGuildChallenge, item.ctaButtonText]);

      const handleButtonAction = useCallback(() => {
        // trigger follow up CTA if claim has failed
        if (
          isActive &&
          (hasChallengeCompleteError || isJoinGuildChallenge) &&
          ctaUrl
        ) {
          handleCTAPress(ctaUrl);
        }

        // dismiss drawer if claim was successful
        handleDrawerClose();
      }, [ctaUrl, isActive, isJoinGuildChallenge]);

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
              {isActive && item.title && <Text>{item.description}</Text>}
              {isActive && hasChallengeCompleteError && (
                <Text color="red">{`Complete the challenge first.`}</Text>
              )}
            </Stack>
            <PointsPill
              points={Number(0)}
              unit={PageConsts.drawerSubtitleUnit}
              textColor="#151515"
            />
          </Stack>
          <Button
            variant="contained"
            isLoading={claimChallenge.isPending}
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
            <b>Challenges</b>: Head to the “Challenges” tab, complete tasks,
            earn points, and advance from Level 0 to Level 4.
          </Text>
          <Text gutterBottom lineHeight="160%">
            • <b>Leaderboard</b>: Check your rank in the “Leaderboard” tab, join
            a guild, and compete for extra points. The top guild each day wins
            100 bonus points per member.
          </Text>
          <Text gutterBottom lineHeight="160%">
            • <b>Prizes</b>: Redeem rewards through the “Prizes” tab as you
            level up, available both at ETH Denver and online.
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
