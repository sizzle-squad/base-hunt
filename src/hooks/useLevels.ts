import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Level } from './types';
import { routes } from '@/constants/routes';
import { LevelNumber } from '@/components/LevelsBadge';

type Props = {
  gameId: string;
  address: string;
};

type LevelsReturnType = {
  currentLevelIdx: LevelNumber | null;
  levels: Level[];
};

export function useLevels({ gameId, address }: Props) {
  const { data, isLoading, error } = useQuery<LevelsReturnType>(
    ['levels', gameId],
    async () => {
      const result = await axios({
        method: 'GET',
        url: `${routes.levels}?gameId=${gameId}&userAddress=${address}`,
      });

      return {
        ...result.data,
        currentLevelIdx: result.data.currentLevelIdx
          ? result.data.currentLevelIdx
          : '0',
      };

      return result.data;
    },
    {
      enabled: gameId !== undefined,
      onError: (error) => {
        console.error(error);
        // Handle error appropriately
      },
    }
  );

  return useMemo(
    () => ({
      data: data ?? {
        currentLevelIdx: null,
        levels: [],
      },
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
