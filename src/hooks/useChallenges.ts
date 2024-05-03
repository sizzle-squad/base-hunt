import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { routes } from '@/constants/routes';

import { Challenge } from './types';

type Props = {
  userAddress: `0x${string}` | undefined;
  gameId: string;
};

export function useChallenges({ userAddress, gameId }: Props) {
  const { data, isLoading, error } = useQuery<Challenge[]>({
    queryKey: ['challenges', userAddress, gameId],
    queryFn: async () => {
      const challenges = await axios({
        method: 'GET',
        url: `${routes.challenges.default}`,
        params: {
          userAddress: userAddress,
          gameId: gameId,
        },
      });

      return challenges.data;
    },
    enabled: !!userAddress && gameId !== undefined,
  });

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
