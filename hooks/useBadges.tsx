import { useQuery } from 'react-query';
import axios from 'axios';
import { routes } from '@/constants/routes';
import { BASE_HUNT_GAME_ID } from '@/utils/env';

type Props = {
  address: `0x${string}` | undefined;
  isConnected: boolean;
};

export function useBadges({ address, isConnected }: Props) {
  // Custom hook to get all badges
  const useGetBadges = () =>
    useQuery(
      ['badges', address],
      async () => {
        const response = await axios.get(
          `${routes.badges.list}?walletAddress=${address}&gameId=${BASE_HUNT_GAME_ID}`
        );
        return response.data;
      },
      {
        enabled: isConnected,
        refetchOnWindowFocus: false,
      }
    );

  // Custom hook to get a single badge
  const useGetBadge = ({ badgeId }: { badgeId: string }) =>
    useQuery(
      ['badge', badgeId, address],
      async () => {
        const response = await axios.get(
          `${routes.badges.single}?walletAddress=${address}&gameId=${BASE_HUNT_GAME_ID}&badgeId=${badgeId}`
        );
        return response.data;
      },
      {
        enabled: isConnected && !!badgeId,
        refetchOnWindowFocus: false,
        onError: (error) => {
          console.error(error);
          // Handle error appropriately
        },
      }
    );

  return {
    useGetBadges,
    useGetBadge,
  };
}
