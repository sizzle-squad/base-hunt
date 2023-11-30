'use client';

import SwipeUpDrawer from '@/components/Badges/BaseSwipeUpDrawer';
import ListCard, { ListCardProps } from '@/components/ListCard';
import ToolBar from '@/components/drawer/Toolbar';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { useDrawer } from '@/context/DrawerContext';
import { Box, Button, NoSsr, Stack } from '@mui/material';
import { ReactElement, memo, useCallback, useMemo, useState } from 'react';
import { DrawerType } from '@/context/DrawerContext';
import Text from '@/components/Text';
import { PointsPill } from '@/components/PointsPill';
import { useLevels } from '@/hooks/useLevels';
import { GAME_ID } from '@/constants/gameId';
import SvgSwitcher, { LevelNumber } from '@/components/LevelsBadge';
import { Level } from '@/hooks/types';
import Pill from '@/components/Pill';
import { useScore } from '@/hooks/useScore';
import { useAccount } from 'wagmi';

const EllipsisIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g opacity="0.4">
      <circle cx="3" cy="8" r="1" fill="#1D1818" />
      <circle cx="8" cy="8" r="1" fill="#1D1818" />
      <circle cx="13" cy="8" r="1" fill="#1D1818" />
    </g>
  </svg>
));
EllipsisIcon.displayName = 'ellipsisIcon';

type ListCardPropsWithDescription = ListCardProps & {
  description: string | ReactElement;
};

const PageConsts = {
  navTitle: 'Levels' as const,
  drawerTitle: 'Rewards' as const,
  drawerButtonText: 'Visit merch store' as const,
  drawerType: 'levelsAction' as DrawerType,
  drawerAnchor: 'bottom' as const,
} as const;

export default function LevelsPageClient() {
  const { data: collection, isLoading, error } = useLevels({ gameId: GAME_ID });
  const { address, isConnected } = useAccount();
  const { data: score, isLoading: isScoreLoading } = useScore({
    userAddress: address ?? '',
    gameId: GAME_ID,
  });
  console.log(
    '🚀 ~ file: LevelsClient.tsx:57 ~ LevelsPageClient ~ score:',
    score
  );

  const [activeItem, setActiveItem] =
    useState<ListCardPropsWithDescription | null>(null);
  const { drawerStates, toggleDrawer } = useDrawer();

  const isOpen = useMemo(
    () => Boolean(drawerStates.levelsAction[PageConsts.drawerAnchor]),
    [drawerStates.levelsAction]
  );

  const handleToggleDrawer = useCallback(
    (item: ListCardPropsWithDescription) => {
      setActiveItem(item);
      toggleDrawer(PageConsts.drawerType, PageConsts.drawerAnchor, !isOpen);
    },
    [isOpen, toggleDrawer]
  );

  const ToggleDrawerButton = memo(
    ({
      item,
      onClick,
    }: {
      item: ListCardPropsWithDescription;
      onClick: (item: ListCardPropsWithDescription) => void;
    }) => (
      <Box onClick={() => onClick(item)}>
        <EllipsisIcon />
      </Box>
    )
  );

  const ToolbarWithClose = memo(
    ({
      title,
      onClick,
      item,
    }: {
      title: string;
      onClick: (item: ListCardPropsWithDescription) => void;
      item: ListCardPropsWithDescription;
    }) => <ToolBar title={title} onDismiss={() => onClick(item)} />
  );

  ToggleDrawerButton.displayName = 'ToggleDrawerButton';
  ToolbarWithClose.displayName = 'ToolbarWithClose';

  const LevelDrawerContent = ({
    item,
  }: {
    item: ListCardPropsWithDescription;
  }) => (
    <Stack spacing={2}>
      {item.title && (
        <>
          <ToolbarWithClose
            item={item}
            onClick={handleToggleDrawer}
            title={PageConsts.drawerTitle}
          />
          <Text variant="h4">{item.title}</Text>
        </>
      )}
      <Text>{item.description}</Text>
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
      >
        {PageConsts.drawerButtonText}
      </Button>
    </Stack>
  );

  // TODO: better loading UX
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <DetailsPageNavbar title={PageConsts.navTitle} />
      <NoSsr>
        <Stack gap={2}>
          {collection.map((item: Level, index: number) => {
            const currentLevel = parseInt(score?.currentLevel?.level as string);
            const itemLevel = parseInt(item.level) - 1;
            const levelMatch = currentLevel === itemLevel;
            const content: ListCardPropsWithDescription = {
              title: `Level ${item.level}`,
              subtitle: `${item.thresholdPoints} points required`,
              startContent: (
                <SvgSwitcher
                  alt={`Level ${item.level}`}
                  level={index.toString() as LevelNumber}
                  width={32}
                  height={32}
                />
              ),
              description: item.description,
            };

            if (levelMatch) {
              content.titleDecoration = (
                <Pill>
                  <Text useMonoFont fontSize="14px">
                    Current
                  </Text>
                </Pill>
              );
            }

            return (
              <ListCard
                key={index}
                {...content}
                endContent={
                  <ToggleDrawerButton
                    item={content}
                    onClick={handleToggleDrawer}
                  />
                }
              />
            );
          })}
        </Stack>
        <SwipeUpDrawer
          toolbarTitle={PageConsts.drawerTitle}
          type={PageConsts.drawerType}
          handleClose={handleToggleDrawer}
          open={isOpen}
        >
          {activeItem && <LevelDrawerContent item={activeItem} />}
        </SwipeUpDrawer>
      </NoSsr>
    </>
  );
}
