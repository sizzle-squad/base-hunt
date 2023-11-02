import { useQuery } from 'react-query';
import { BASE_HUNT_GAME_ID, WALLET_API_URL } from '@/utils/env';
import axios from 'axios';
import { MOCK_BADGES } from '@/utils/mock/badges';

type Props = {
  address: `0x${string}` | undefined;
};

export function useGetBadges({ address }: Props) {
  const { data, error, isLoading } = useQuery(
    ['badges', address],
    async () => {
      return await axios({
        method: 'GET',
        url: `${WALLET_API_URL}/basehunt/badges/${BASE_HUNT_GAME_ID}/${address}`,
      });
    },
    {
      // TODO: fetch it from real endpoint
      enabled: false,
    }
  );

  if (error) {
    console.log(error);
    throw error;
  }

  return {
    data: MOCK_BADGES,
    isLoading,
  };
}
