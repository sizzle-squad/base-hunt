import { routes } from '@/constants/routes';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useMemo } from 'react';

type Props = {
  gameId: string;
};

export function useMetrics({ gameId }: Props) {
  const { data, isLoading, error } = useQuery(
    ['metrics', gameId],
    async () => {
      const metrics = await axios({
        method: 'GET',
        url: `${routes.metrics}`,
        params: {
          gameId: gameId,
        },
      });
      return metrics.data;
    },
    {
      enabled: gameId !== undefined,
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
