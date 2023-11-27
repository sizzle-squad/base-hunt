import axios from 'axios';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

type Props = {
  userAddress: `0x${string}` | string;
  gameId: string;
};

type RankReturnType = {
  data: {
    rank: string;
    userAddress: string;
  };
};

export function useRank({ userAddress, gameId }: Props) {
  const { data, isLoading, error } = useQuery<RankReturnType>(
    ['treasure-box/rank', userAddress, gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: `/api/treasure-box/rank?userAddress=${userAddress}&gameId=${gameId}`,
      });
    },
    {
      enabled: !!userAddress && gameId !== undefined,
      onError: (error) => {
        console.error(error);
        // Handle error appropriately
      },
    }
  );

  return useMemo(
    () => ({
      data: data?.data,
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
