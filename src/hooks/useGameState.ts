import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { routes } from '@/constants/routes';
import { sortWithBigInt } from '@/utils/sortWithBigInt';

import { Badge, BadgeTypeEnum } from './types';

type Props = {
  userAddress?: `0x${string}`;
  gameId: string;
};

// TODO: implemet this function to return user game state for OCS
export function useGameState({ userAddress, gameId }: Props) {
  return {};
}
