import { routes } from '@/constants/routes';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Badge } from './types';

type Props = {
  userAddress: `0x${string}`;
  gameId: string;
};

export function useGameState({ userAddress, gameId }: Props) {
  const { data, isLoading } = useQuery<Badge[]>(
    ['profile/state', userAddress, gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: `${routes.profile.state}?userAddress=${userAddress}&gameId=${gameId}`,
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
