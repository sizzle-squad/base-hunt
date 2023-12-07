'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type DrawerType =
  | 'walletOperations'
  | 'badgeActions'
  | 'levelsAction'
  | 'artRevealAction';

interface DrawerStates {
  walletOperations: Record<string, boolean>;
  badgeActions: Record<string, boolean>;
  levelsAction: Record<string, boolean>;
  boostsAction: Record<string, boolean>;
  artRevealAction: Record<string, boolean>;
}

interface DrawerContextType {
  drawerStates: DrawerStates;
  toggleDrawer: (type: DrawerType, anchor: string, open: boolean) => void;
}

interface DrawerProviderProps {
  children: React.ReactNode;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider: React.FunctionComponent<DrawerProviderProps> = ({
  children,
}) => {
  const [drawerStates, setDrawerStates] = useState<DrawerStates>({
    walletOperations: {},
    badgeActions: {},
    levelsAction: {},
    boostsAction: {},
    artRevealAction: {},
  });

  const toggleDrawer = useCallback(
    (type: DrawerType, anchor: string, open: boolean) => {
      setDrawerStates((prevStates) => ({
        ...prevStates,
        [type]: { ...prevStates[type], [anchor]: open },
      }));
    },
    []
  );

  const value = useMemo(
    () => ({ drawerStates, toggleDrawer }),
    [drawerStates, toggleDrawer]
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);

  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
