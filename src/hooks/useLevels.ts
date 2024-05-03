import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { LevelNumber } from '@/components/LevelsBadge';
import { routes } from '@/constants/routes';

import { Level } from './types';

type Props = {
  gameId: string;
  address: string;
};

type LevelsReturnType = {
  currentLevelIdx: LevelNumber | null;
  levels: Level[];
};

export function useLevels({ gameId, address }: Props) {
  const { data, isLoading, error, refetch } = useQuery<LevelsReturnType>({
    queryKey: ['levels', gameId, address],
    queryFn: async () => {
      const result = await axios({
        method: 'GET',
        url: `${routes.profile.levels}?gameId=${gameId}&userAddress=${address}`,
      });

      return result.data;
    },
    enabled: gameId !== undefined,
  });

  return useMemo(
    () => ({
      data: data ?? {
        currentLevelIdx: null,
        levels: [],
      },
      isLoading,
      error,
      refetch,
    }),
    [data, error, isLoading, refetch]
  );
}
