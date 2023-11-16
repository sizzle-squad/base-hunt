import { useQuery } from 'react-query';
import axios from 'axios';
import { routes } from '@/constants/routes';

type Props = {
  gameId: string;
};

type TreasureBoxType = {
  data: {
    gameId: string;
    totalHitpoints: bigint;
    isOpen: boolean;
    location?: string;
  };
};

type TreasureBotReturnType = Omit<TreasureBoxType, 'gameId'>;

export function useTreasureBox({ gameId }: Props) {
  const { data, isLoading } = useQuery<TreasureBotReturnType>(
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
    }
  );

  return {
    data: data?.data,
    isLoading,
  };
}
