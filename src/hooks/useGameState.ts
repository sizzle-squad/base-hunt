import { routes } from '@/constants/routes';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Badge } from './types';
import { useAccount } from 'wagmi';

type Props = {
  userAddress: `0x${string}`;
  gameId: string;
};

export function useGameState() {
  const { address: userAddress, isDisconnected } = useAccount();
  const gameId = process.env.NEXT_PUBLIC_GAME_ID;

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
