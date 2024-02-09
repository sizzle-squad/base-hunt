import { useMemo } from 'react';

import axios from 'axios';
import { useQuery } from 'react-query';

import { GuildData } from '@/app/api/profile/guild/route';
import { routes } from '@/constants/routes';

type Props = {
  userAddress?: `0x${string}`;
  gameId: string;
};

export function useGuildState({ userAddress, gameId }: Props) {
  const { data, isLoading, error } = useQuery<GuildData>(
    ['profile/guild', userAddress, gameId],
    async () => {
      const guild = await axios({
        method: 'GET',
        url: `${routes.profile.guild}?userAddress=${userAddress}&gameId=${gameId}`,
      });

      return guild.data;
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
      data,
      isLoading,
      error,
      hasGuild: data?.id !== null,
    }),
    [data, error, isLoading]
  );
}
