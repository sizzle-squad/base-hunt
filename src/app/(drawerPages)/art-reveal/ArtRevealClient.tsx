'use client';

import SwipeUpDrawer from '@/components/Badges/BaseSwipeUpDrawer';
import { ListCardProps } from '@/components/ListCard';
import ToolBar from '@/components/drawer/Toolbar';
import { DrawerType, useDrawer } from '@/context/DrawerContext';
import { Box, NoSsr, Stack } from '@mui/material';
import { memo, useCallback, useMemo, useState } from 'react';
import Text from '@/components/Text';
import { RevealedCard } from '@/components/assets/RevealedCard';
import { Card } from '@/components/assets/Card';

const PageConsts = {
  navTitle: 'Art Reveal' as const,
  drawerTitle: 'Artwork' as const,
  drawerSubtitle: 'Completed 3 times' as const,
  drawerType: 'artRevealAction' as DrawerType,
  drawerAnchor: 'bottom' as const,
} as const;

const artwork = {
  title: 'TITLE OF THE ARTWORK',
  description:
    'Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. ',
  artistName: 'Artist Name',
};

export type RevealedArtListCard = ListCardProps & {
  artistName: string;
  description: string;
};

export default function ArtRevealClient() {
  const [activeItem, setActiveItem] = useState<RevealedArtListCard | null>(
    null
  );
  const { drawerStates, toggleDrawer } = useDrawer();

  const isOpen = useMemo(
    () => Boolean(drawerStates.artRevealAction[PageConsts.drawerAnchor]),
    [drawerStates.artRevealAction]
  );

  const handleToggleDrawer = useCallback(
    (item: RevealedArtListCard) => {
      // TODO: get this from API
      setActiveItem(artwork);
      toggleDrawer(PageConsts.drawerType, PageConsts.drawerAnchor, !isOpen);
    },
    [isOpen, toggleDrawer]
  );

  const ToggleDrawerButton = memo(
    ({
      item,
      onClick,
    }: {
      item: RevealedArtListCard;
      onClick: (item: RevealedArtListCard) => void;
    }) => <></>
  );
  ToggleDrawerButton.displayName = 'ToggleDrawerButton';

  const ToolbarWithClose = memo(
    ({
      title,
      onClick,
      item,
    }: {
      title: string;
      onClick: (item: RevealedArtListCard) => void;
      item: RevealedArtListCard;
    }) => <ToolBar title={title} onDismiss={() => onClick(item)} />
  );
  ToolbarWithClose.displayName = 'ToolbarWithClose';

  const ArtRevealDrawerContent = ({ item }: { item: RevealedArtListCard }) => {
    return (
      <Stack spacing={2}>
        {item.title && (
          <>
            <ToolbarWithClose
              item={item}
              onClick={handleToggleDrawer}
              title={PageConsts.drawerTitle}
            />
            <Text variant="h5">{item.title}</Text>
            <Text>{item.artistName}</Text>
          </>
        )}
        <Text>{item.description}</Text>
      </Stack>
    );
  };

  return (
    <>
      <Card>
        <RevealedCard onClick={handleToggleDrawer} />
      </Card>
      <NoSsr>
        <SwipeUpDrawer
          toolbarTitle={PageConsts.drawerTitle}
          type={PageConsts.drawerType}
          handleClose={handleToggleDrawer}
          open={isOpen}
        >
          {activeItem && <ArtRevealDrawerContent item={activeItem} />}
        </SwipeUpDrawer>
      </NoSsr>
    </>
  );
}
