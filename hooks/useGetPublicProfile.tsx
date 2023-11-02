import { useQuery } from 'react-query';
import axios from 'axios';
import { WALLET_API_URL } from '@/utils/env';
import { UserPublicProfile } from './types';

// https://api.wallet.coinbase.com/rpc/v2/getPublicProfileByAddress?queryAddress=0x86c3854CbcF98c8932935d599A98d737C10d8DA2
type Props = {
  address: `0x${string}` | undefined;
};

export function useGetPublicProfile({ address }: Props) {
  const { data, error, isLoading } = useQuery<UserPublicProfile>(
    ['getPublicProfileByAddress', address],
    async () => {
      return await axios({
        method: 'GET',
        url: `${WALLET_API_URL}/getPublicProfileByAddress`,
        params: {
          queryAddress: address,
        },
      });
    },
    {
      enabled: !!address,
    }
  );

  if (error) {
    console.log(error);
    throw error;
  }

  return {
    data: data?.data?.result,
    isLoading,
  };
}
