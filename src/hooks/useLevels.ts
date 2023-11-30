import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Level } from './types';

type Props = {
  gameId: string;
};

type LevelsReturnType = {
  data: {
    data: Level[];
  };
};

export function useLevels({ gameId }: Props) {
  const { data, isLoading, error } = useQuery(
    ['levels', gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: `/api/levels?gameId=${gameId}`,
      });
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
      data: data?.data ?? [],
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
