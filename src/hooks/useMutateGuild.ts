import { routes } from '@/constants/routes';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export type GuildPostBodyData = {
  userAddress: `0x${string}` | undefined;
  gameId: string;
  guildId: string;
};

export function useMutateGuild() {
  const queryClient = useQueryClient();
  const joinGuild = useMutation(
    (data: GuildPostBodyData) => {
      const { gameId, userAddress, guildId } = data;

      if (!userAddress || !gameId || !guildId) {
        throw new Error(
          `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, guildId: ${guildId}`
        );
      }

      return axios.post(routes.guild.default, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile/guild'] });
      },
    }
  );

  return { joinGuild };
}
