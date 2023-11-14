import { useQuery } from 'react-query';
import axios from 'axios';
import { WALLET_API_URL } from '@/utils/env';
import { UserPublicProfile } from './types';
import { routes } from '@/constants/routes';

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

  return {
    data: data?.data,
    isLoading,
  };
}
