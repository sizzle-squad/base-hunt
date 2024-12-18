'use client';

import { memo, ReactElement, useCallback, useMemo, useState } from 'react';

import { Box, Button, Stack } from '@mui/material';
import { useAccount } from 'wagmi';

import SwipeUpDrawer from '@/components/Badges/BaseSwipeUpDrawer';
import ToolBar from '@/components/drawer/Toolbar';
import SvgSwitcher, { LevelNumber } from '@/components/LevelsBadge';
import ListCard, { ListCardProps } from '@/components/ListCard';
import DetailsPageNavbar from '@/components/navigation/DetailsPageNavbar';
import Pill from '@/components/Pill';
import Text from '@/components/Text';
import { GAME_ID } from '@/constants/gameId';
import { useDrawer } from '@/context/DrawerContext';
import { DrawerType } from '@/context/DrawerContext';
import { Level } from '@/hooks/types';
import { useLevels } from '@/hooks/useLevels';

const merchStoreUrl = 'https://basedmerch.slice.so/';

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
  navTitle: 'Get your exclusive merch' as const,
  drawerTitle: 'Rewards' as const,
  drawerButtonText: 'Visit merch store' as const,
  drawerType: 'levelsAction' as DrawerType,
  drawerAnchor: 'bottom' as const,
} as const;

export default function LevelsPageClient() {
  const loadingCollection = useMemo(() => [null, null, null, null], []);
  const { address, isConnected } = useAccount();
  const { data: collection, isLoading } = useLevels({
    gameId: GAME_ID,
    address: address ?? '',
  });

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
      <Text whiteSpace="pre-line">{item.description}</Text>
      <Button
        href={merchStoreUrl}
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

  return (
    <Stack gap="24px">
      <DetailsPageNavbar title={PageConsts.navTitle} />
      <Stack gap={2} className="pageContent">
        {isLoading &&
          loadingCollection.map((_, index) => (
            <ListCard key={index} isLoading={isLoading} />
          ))}
        {collection &&
          collection.levels &&
          collection.levels.map((item: Level, index: number) => {
            const toggleDrawer = () => {
              handleToggleDrawer(item);
            };
            const isCurrent =
              collection.currentLevelIdx === null
                ? false
                : parseInt(collection.currentLevelIdx) === index;
            const content: ListCardPropsWithDescription = {
              title: `Level ${item.level} Merch Unlocked`,
              subtitle: `${item.thresholdPoints} points required`,
              startContent: (
                <SvgSwitcher
                  alt={`Level ${item.level}`}
                  level={item.level as LevelNumber}
                  width={32}
                  height={32}
                />
              ),
              description: item.description,
            };

            if (isCurrent) {
              content.titleDecoration = (
                <Pill>
                  <Text useMonoFont fontSize="14px">
                    Current
                  </Text>
                </Pill>
              );
            }

            return (
              <Box
                sx={{
                  ':hover': {
                    cursor: 'pointer',
                  },
                }}
                key={index}
                onClick={toggleDrawer}
              >
                <ListCard {...content} endContent={<EllipsisIcon />} />
              </Box>
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
    </Stack>
  );
}
