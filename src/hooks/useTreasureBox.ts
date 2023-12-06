import { useQuery } from 'react-query';
import axios from 'axios';
import { routes } from '@/constants/routes';
import { useMemo } from 'react';

type Props = {
  gameId: string;
  userAddress: string;
};

type TreasureBoxType = {
  data: {
    gameId: string;
    totalHitpoints: bigint;
    isOpen: boolean;
    location?: string;
    currentHitpoints: bigint;
    ctaUrl: string;
  };
};

type TreasureBoxReturnType = Omit<TreasureBoxType, 'gameId'>;
type TreasureBoxStateReturnType = {
  data: {
    isCTAEligible: boolean;
    nextEligibleDate: Date;
  };
};

export function useTreasureBox({ gameId, userAddress }: Props) {
  const { data, isLoading, error } = useQuery<TreasureBoxReturnType>(
    ['treasure-box', gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: routes.treasureBox.default,
        params: {
          gameId: gameId,
          userAddress,
        },
      });
    },
    {
      enabled: gameId !== undefined,
      onError: (error) => {
        console.error(error);
        // Handle error appropriately
      },
      staleTime: 1000 * 30, // 30 seconds
    }
  );

  const {
    data: stateData,
    isLoading: stateDataIsLoading,
    error: stateError,
  } = useQuery<TreasureBoxStateReturnType>(
    ['treasure-box-state', gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: routes.treasureBox.state,
        params: {
          gameId: gameId,
          userAddress,
        },
      });
    },
    {
      enabled: gameId !== undefined,
      onError: (error) => {
        console.error(error);
        // Handle error appropriately
      },
      staleTime: 1000 * 30, // 30 seconds
    }
  );

  return useMemo(
    () => ({
      data: data?.data,
      isLoading,
      error,
      stateData: stateData?.data,
      stateDataIsLoading,
      stateError,
    }),
    [
      data?.data,
      error,
      isLoading,
      stateData?.data,
      stateDataIsLoading,
      stateError,
    ]
  );
}
