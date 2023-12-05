import { routes } from '@/constants/routes';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Boost } from './types';
import { useMemo } from 'react';

type Props = {
  userAddress: `0x${string}` | undefined;
  gameId: string;
};

export function useBoosts({ userAddress, gameId }: Props) {
  const { data, isLoading, error } = useQuery<Boost[]>(
    ['boosts'],
    async () => {
      const boosts = await axios({
        method: 'GET',
        url: `${routes.boosts.default}`,
        params: {
          userAddress: userAddress,
          gameId: gameId,
        },
      });
      return boosts.data;
    },
    {
      enabled: !!userAddress && gameId !== undefined,
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
