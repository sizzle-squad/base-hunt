import { useQuery } from 'react-query';
import { BASE_HUNT_GAME_ID, WALLET_API_URL } from '@/utils/env';
import axios from 'axios';
import { MOCK_BADGES } from '@/utils/mock/badges';
import { routes } from '@/constants/routes';

type Props = {
  address: `0x${string}` | undefined;
  isConnected: boolean;
};

export function useGetBadges({ address, isConnected }: Props) {
  const { data, error, isLoading } = useQuery(
    ['badges', address],
    async () => {
      return await axios({
        method: 'GET',
        // move this to our nextjs api
        url: `${routes.badges.list}?walletAddress=${address}&gameId=${BASE_HUNT_GAME_ID}`,
      })
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
          return MOCK_BADGES;
        });
    },
    {
      // TODO: fetch it from real endpoint
      enabled: isConnected,
      refetchOnWindowFocus: false,
    }
  );

  if (error) {
    console.log(error);
    throw error;
  }

  return {
    data,
    isLoading,
  };
}
