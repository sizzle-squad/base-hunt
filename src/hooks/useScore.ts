import { routes } from '@/constants/routes';
import axios from 'axios';
import { useQuery } from 'react-query';
import { ScoreState } from './types';

type Props = {
  userAddress: `0x${string}`;
  gameId: string;
};

export function useScore({ userAddress, gameId }: Props) {
  const { data, isLoading } = useQuery<ScoreState>(
    ['profile/score', userAddress, gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: `${routes.profile.score}?userAddress=${userAddress}&gameId=${gameId}`,
      });
    },
    {
      enabled: !!userAddress && !!gameId,
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
