import { useQuery } from 'react-query';
import axios from 'axios';
import { UserPublicProfile } from './types';
import { routes } from '@/constants/routes';
import { useMemo } from 'react';

type Props = {
  address: `0x${string}` | undefined;
};

export function useCBProfile({ address }: Props) {
  const { data, error, isLoading } = useQuery<UserPublicProfile>(
    ['getPublicProfileByAddress', address],
    async () => {
      return await axios({
        method: 'GET',
        url: `${routes.cbProfile}?userAddress=${address}`,
        params: {
          queryAddress: address,
        },
      });
    },
    {
      enabled: !!address,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
      onError: (error) => {
        console.error(error);
        // Handle error appropriately
      },
    }
  );

  return useMemo(
    () => ({
      data: data?.data,
      isLoading,
      error,
    }),
    [data?.data, error, isLoading]
  );
}
