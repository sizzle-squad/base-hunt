import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from 'react-query';

import { routes } from '@/constants/routes';

import { Guild } from './types';

type Props = {
  gameId: string;
};

export function useGuild({ gameId }: Props) {
  const { data, isLoading, error } = useQuery<Guild[]>(
    'guild',
    async () => {
      const guilds = await axios({
        method: 'GET',
        url: routes.guild.default,
        params: {
          gameId,
        },
      });

      return guilds.data;
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
      data: data ?? ([] as Guild[]),
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
