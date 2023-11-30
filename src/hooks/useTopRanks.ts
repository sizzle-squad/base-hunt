import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Rank } from './types';

type Props = {
  gameId: string;
};

type TopRankReturnType = {
  data: Rank[];
};

export function useTopRanks({ gameId }: Props) {
  const { data, isLoading, error } = useQuery<TopRankReturnType>(
    ['treasure-box/top-ranks', gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: `/api/treasure-box/top-ranks?gameId=${gameId}`,
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
