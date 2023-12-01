import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Level } from './types';
import { routes } from '@/constants/routes';

type Props = {
  gameId: string;
  address: string;
};

type LevelsReturnType = {
  data: {
    data: Level[];
  };
};

export function useLevels({ gameId, address }: Props) {
  const { data, isLoading, error } = useQuery(
    ['levels', gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: `${routes.levels}?gameId=${gameId}&userAddress=${address}`,
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
