import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { routes } from '@/constants/routes';

import { ScoreState } from './types';

type Props = {
  userAddress: `0x${string}` | string;
  gameId: string;
};

export function useScore({ userAddress, gameId }: Props) {
  const { data, isLoading, error, refetch } = useQuery<ScoreState>({
    queryKey: ['profile/score', userAddress, gameId],
    queryFn: async () => {
      const score = await axios({
        method: 'GET',
        url: `${routes.profile.score}?userAddress=${userAddress}&gameId=${gameId}`,
      });
      return score.data;
    },
    enabled: !!userAddress && gameId !== undefined,
  });

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      refetch,
    }),
    [data, error, isLoading, refetch]
  );
}
