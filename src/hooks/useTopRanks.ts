import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { PlayerRank, Rank } from './types';

type Props = {
  gameId: string;
};

type TopRankReturnType = {
  data: PlayerRank[];
};

export function useTopRanks({ gameId }: Props) {
  const { data, isLoading, error } = useQuery<TopRankReturnType>({
    queryKey: ['leaderboard/top', gameId],
    queryFn: async () => {
      return await axios({
        method: 'GET',
        url: `/api/leaderboard?gameId=${gameId}`,
      });
    },
    enabled: gameId !== undefined,
  });

  return useMemo(
    () => ({
      data: data?.data ?? [],
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
