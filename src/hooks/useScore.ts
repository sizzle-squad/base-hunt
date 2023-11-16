import { routes } from '@/constants/routes';
import axios from 'axios';
import { useQuery } from 'react-query';
import { ScoreState } from './types';
import { useAccount } from 'wagmi';

type Props = {
  userAddress: `0x${string}` | string;
  gameId: string;
};

export function useScore({ userAddress, gameId }: Props) {
  const { data, isLoading } = useQuery<ScoreState>(
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

  return {
    data,
    isLoading,
  };
}
