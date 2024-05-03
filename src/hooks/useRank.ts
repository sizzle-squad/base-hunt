import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { PlayerRank } from './types';

type Props = {
  userAddress: `0x${string}` | string;
  gameId: string;
};

type RankReturnType = {
  data: PlayerRank;
};

export function useRank({ userAddress, gameId }: Props) {
  const { data, isLoading, error, refetch } = useQuery<RankReturnType>({
    queryKey: ['leaderboard/rank', userAddress, gameId],
    queryFn: async () => {
      return await axios({
        method: 'GET',
        url: `/api/leaderboard/rank?userAddress=${userAddress}&gameId=${gameId}`,
      });
    },
    enabled: !!userAddress && gameId !== undefined,
  });

  return useMemo(
    () => ({
      data: data?.data,
      isLoading,
      error,
      refetch,
    }),
    [data?.data, error, isLoading, refetch]
  );
}
