import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from 'react-query';

import { routes } from '@/constants/routes';

type Props = {
  gameId: string;
};

type TreasureBoxType = {
  data: {
    gameId: string;
    totalHitpoints: number;
    isOpen: boolean;
    location?: string;
    currentHitpoints: number;
  };
};

type TreasureBoxReturnType = Omit<TreasureBoxType, 'gameId'>;

export function useTreasureBoxForRevealScreen({ gameId }: Props) {
  const { data, isLoading, error } = useQuery<TreasureBoxReturnType>(
    ['treasure-box', gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: routes.treasureBox.default,
        params: {
          gameId: gameId,
        },
      });
    },
    {
      enabled: gameId !== undefined,
      onError: (error) => {
        console.error(error);
        // Handle error appropriately
      },
      refetchInterval: 1000 * 5, // 5 seconds
    }
  );

  return useMemo(
    () => ({
      data: data?.data,
      isLoading,
      error,
    }),
    [data?.data, error, isLoading]
  );
}
