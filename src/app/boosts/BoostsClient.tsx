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

type ListCardPropsForBoosts = ListCardProps & {
  explanation?: string;
  points: number;
  cta: string;
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

const BoostsCollection = [
  {
    title: 'Buy Merch',
    subtitle: '4 points required',
    cta: 'Visit merch store',
    points: 30,
    completed: {
      times: 3,
      maxTimes: 5,
    },
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
    endContent: <Text>30 pts</Text>,
  },
  {
    title: 'Buy coffee from Base Cafe',
    subtitle: '8 points required',
    cta: 'Visit Base Cafe',
    points: 100,
    explanation: 'Max 5 times',
    completed: {
      times: 3,
      maxTimes: 5,
    },
    startContent: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 6V3H12L18 5V6H6Z" stroke="black" stroke-width="1.5" />
        <rect
          x="5"
          y="6"
          width="14"
          height="3"
          rx="1.5"
          stroke="black"
          stroke-width="1.5"
        />
        <path
          d="M7.88 21L6.5 9H18L16.16 21H7.88Z"
          stroke="black"
          stroke-width="1.5"
        />
        <path d="M7 11.5H17.5" stroke="black" stroke-width="1.5" />
        <path d="M8 17.5H16" stroke="black" stroke-width="1.5" />
      </svg>
    ),
    endContent: <Text>100 pts</Text>,
  },
] as ListCardPropsForBoosts[];

export default function BoostsPageClient() {
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

  const ToggleDrawerButton = memo(
    ({
      item,
      onClick,
    }: {
      item: ListCardPropsForBoosts;
      onClick: (item: ListCardPropsForBoosts) => void;
    }) => <Box onClick={() => onClick(item)}>{item.endContent}</Box>
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
              <Text>{PageConsts.drawerSubtitle}</Text>
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
      >
        {item.cta}
      </Button>
    </Stack>
  );

  return (
    <>
      <DetailsPageNavbar title={PageConsts.navTitle} />
      <NoSsr>
        <Stack gap={2}>
          {BoostsCollection.map((item, index) => (
            <ListCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              startContent={item.startContent}
              endContent={
                <ToggleDrawerButton item={item} onClick={handleToggleDrawer} />
              }
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
    </>
  );
}
