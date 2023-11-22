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

type ListCardPropsWithExplanation = ListCardProps & {
  explanation?: string;
};

const collection = [
  {
    title: 'Buy Merch',
    subtitle: '4 points required',
    startContent: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.64359 8.28868L16 0.57735L29.3564 8.28868V23.7113L16 31.4227L2.64359 23.7113V8.28868Z"
          fill="white"
          stroke="#1D1818"
        />
        <path
          d="M12.0795 13.7044V18.2247L15.954 20.4855L19.8297 18.2247V13.7044L15.954 11.4436L12.0795 13.7044Z"
          stroke="#1D1818"
        />
      </svg>
    ),
    endContent: (
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
    ),
  },
  {
    title: 'Buy coffee from Base Cafe',
    subtitle: '8 points required',
    explanation: 'Max 5 times',
    startContent: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.64359 8.28868L16 0.57735L29.3564 8.28868V23.7113L16 31.4227L2.64359 23.7113V8.28868Z"
          fill="#1D1818"
          stroke="white"
        />
        <path
          d="M8.26489 11.5853V16.1056L12.1394 18.3664L16.0151 16.1056V11.5853L12.1394 9.32446L8.26489 11.5853Z"
          stroke="white"
        />
        <path
          d="M16 16.1417V20.662L19.8745 22.9228L23.7502 20.662V16.1417L19.8745 13.8809L16 16.1417Z"
          stroke="white"
        />
        <path d="M12.1854 13.8809L19.8146 18.4372" stroke="white" />
      </svg>
    ),
    endContent: (
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
    ),
  },
] as ListCardPropsWithExplanation[];

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

export default function BoostsPageClient() {
  const [activeItem, setActiveItem] =
    useState<ListCardPropsWithExplanation | null>(null);
  const { drawerStates, toggleDrawer } = useDrawer();

  const isOpen = useMemo(
    () => Boolean(drawerStates.boostsAction[PageConsts.drawerAnchor]),
    [drawerStates.boostsAction, PageConsts.drawerAnchor]
  );

  const handleToggleDrawer = useCallback(
    (item: ListCardPropsWithExplanation) => {
      setActiveItem(item);
      toggleDrawer(PageConsts.drawerType, PageConsts.drawerAnchor, !isOpen);
    },
    [isOpen, PageConsts.drawerAnchor, PageConsts.drawerType, toggleDrawer]
  );

  const ToggleDrawerButton = memo(
    ({
      item,
      onClick,
    }: {
      item: ListCardPropsWithExplanation;
      onClick: (item: ListCardPropsWithExplanation) => void;
    }) => <Box onClick={() => onClick(item)}>{item.endContent}</Box>
  );

  const ToolbarWithClose = memo(
    ({
      title,
      onClick,
      item,
    }: {
      title: string;
      onClick: (item: ListCardPropsWithExplanation) => void;
      item: ListCardPropsWithExplanation;
    }) => <ToolBar title={title} onDismiss={() => onClick(item)} />
  );

  ToggleDrawerButton.displayName = 'ToggleDrawerButton';
  ToolbarWithClose.displayName = 'ToolbarWithClose';

  const LevelDrawerContent = ({
    item,
  }: {
    item: ListCardPropsWithExplanation;
  }) => (
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
        <PointsPill
          points={PageConsts.drawerSubtitlePoints}
          unit={PageConsts.drawerSubtitleUnit}
        />
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
        {PageConsts.drawerButtonText}
      </Button>
    </Stack>
  );

  return (
    <>
      <DetailsPageNavbar title={PageConsts.navTitle} />
      <NoSsr>
        <Stack gap={2}>
          {collection.map((item, index) => (
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
          {activeItem && <LevelDrawerContent item={activeItem} />}
        </SwipeUpDrawer>
      </NoSsr>
    </>
  );
}
