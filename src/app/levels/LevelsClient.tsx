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

type ListCardPropsWithDescription = ListCardProps & {
  description: string;
  boost?: string;
};

const collection = [
  {
    title: 'Level 1',
    subtitle: '4 points required',
    description:
      'Get a 40% discount on any three items of merchandise from Art Basel and Base.',
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
    title: 'Level 2',
    subtitle: '8 points required',
    description: 'Get a 40% discount on any three items of merchandise.',
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
] as ListCardPropsWithDescription[];

export default function LevelsPageClient() {
  const [activeItem, setActiveItem] =
    useState<ListCardPropsWithDescription | null>(null);
  const { drawerStates, toggleDrawer } = useDrawer();
  const drawerType = 'levelsAction' as DrawerType;
  const anchor = 'bottom' as const;

  const isOpen = useMemo(
    () => Boolean(drawerStates.levelsAction[anchor]),
    [drawerStates.levelsAction, anchor]
  );

  const handleToggleDrawer = useCallback(
    (item: ListCardPropsWithDescription) => {
      setActiveItem(item);
      toggleDrawer(drawerType, anchor, !isOpen);
    },
    [isOpen, anchor, drawerType, toggleDrawer]
  );

  const ToggleDrawerButton = ({
    item,
    onClick,
  }: {
    item: ListCardPropsWithDescription;
    onClick: (item: ListCardPropsWithDescription) => void;
  }) => <Box onClick={() => onClick(item)}>{item.endContent}</Box>;

  ToggleDrawerButton.displayName = 'ToggleDrawerButton';

  memo(ToggleDrawerButton, (prevProps, nextProps) => {
    return prevProps.item === nextProps.item;
  });

  const LevelDrawerContent = ({
    item,
  }: {
    item: ListCardPropsWithDescription;
  }) => (
    <Stack spacing={2}>
      <ToolBar title="Rewards" />

      {item.title && <Text variant="h4">{item.title}</Text>}

      <Text>{item.description}</Text>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Text>Level up boost</Text>
        <PointsPill points={100} unit="pts" />
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
        Visit merch store
      </Button>
    </Stack>
  );

  return (
    <>
      <DetailsPageNavbar title="Level Art" />
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
          toolbarTitle="Rewards"
          type="levelsAction"
          handleClose={handleToggleDrawer}
          open={isOpen}
        >
          {activeItem && <LevelDrawerContent item={activeItem} />}
        </SwipeUpDrawer>
      </NoSsr>
    </>
  );
}
