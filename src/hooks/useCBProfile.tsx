import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { routes } from '@/constants/routes';

import { UserPublicProfile } from './types';

type Props = {
  address: `0x${string}` | undefined;
};

export function useCBProfile({ address }: Props) {
  const { data, error, isLoading } = useQuery<UserPublicProfile>({
    queryKey: ['getPublicProfileByAddress', address],
    queryFn: async () => {
      return await axios({
        method: 'GET',
        url: `${routes.cbProfile}?userAddress=${address}`,
        params: {
          queryAddress: address,
        },
      });
    },
    enabled: !!address && address !== '0x...',
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

  return useMemo(
    () => ({
      data: data?.data,
      isLoading,
      error,
    }),
    [data?.data, error, isLoading]
  );
}
