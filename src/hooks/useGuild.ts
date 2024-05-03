import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { routes } from '@/constants/routes';

import { Guild } from './types';

type Props = {
  gameId: string;
};

export function useGuild({ gameId }: Props) {
  const { data, isLoading, error } = useQuery<Guild[]>({
    queryKey: ['guild', gameId],
    queryFn: async () => {
      const guilds = await axios({
        method: 'GET',
        url: routes.guild.state,
        params: {
          gameId,
        },
      });

      return guilds.data;
    },
    enabled: gameId !== undefined,
  });

  return useMemo(
    () => ({
      data: data ?? ([] as Guild[]),
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
