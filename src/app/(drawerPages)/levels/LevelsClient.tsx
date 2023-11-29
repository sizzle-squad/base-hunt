'use client';

import SwipeUpDrawer from '@/components/Badges/BaseSwipeUpDrawer';
import ListCard, { ListCardProps } from '@/components/ListCard';
import ToolBar from '@/components/drawer/Toolbar';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import { useDrawer } from '@/context/DrawerContext';
import { Box, Button, NoSsr, Stack } from '@mui/material';
import { memo, useCallback, useMemo, useState } from 'react';
import { DrawerType } from '@/context/DrawerContext';
import Text from '@/components/Text';
import { PointsPill } from '@/components/Pill';
import { useLevels } from '@/hooks/useLevels';
import { GAME_ID } from '@/constants/gameId';
import SvgSwitcher, { LevelNumber } from '@/components/LevelsBadge';
import { Level } from '@/hooks/types';

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
  description: string;
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
  const loadingCollection = useMemo(() => [null, null, null, null], []);

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
  // if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <DetailsPageNavbar title={PageConsts.navTitle} />
      <Stack gap={2} className="pageContent">
        {isLoading &&
          loadingCollection.map((_, index) => (
            <ListCard key={index} isLoading={isLoading} />
          ))}
        {collection &&
          collection.map((item: Level, index: number) => {
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
                isLoading={isLoading}
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
    </>
  );
}
