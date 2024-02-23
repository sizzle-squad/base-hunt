import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from 'react-query';

import { routes } from '@/constants/routes';

import { ScoreState } from './types';

type Props = {
  userAddress: `0x${string}` | string;
  gameId: string;
};

export function useScore({ userAddress, gameId }: Props) {
  const { data, isLoading, error, refetch } = useQuery<ScoreState>(
    ['profile/score', userAddress, gameId],
    async () => {
      const score = await axios({
        method: 'GET',
        url: `${routes.profile.score}?userAddress=${userAddress}&gameId=${gameId}`,
      });
      return score.data;
    },
    {
      enabled: !!userAddress && gameId !== undefined,
      onError: (error) => {
        console.error(error);
        // Handle error appropriately
      },
    }
  );

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
