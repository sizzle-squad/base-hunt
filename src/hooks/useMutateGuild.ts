import axios from 'axios';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routes } from '@/constants/routes';

export type GuildPostBodyData = {
  userAddress: `0x${string}` | undefined;
  gameId: string;
  guildId: string;
  referrerAddress?: `0x${string}` | undefined;
  signature?: string;
  secret?: string;
};

export function useMutateGuild() {
  const queryClient = useQueryClient();
  const joinGuild = useMutation({
    mutationFn: (data: GuildPostBodyData) => {
      const { gameId, userAddress, guildId } = data;

      if (!userAddress || !gameId || !guildId) {
        throw new Error(
          `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, guildId: ${guildId}`
        );
      }

      return axios.post(routes.guild.default, data);
    },
    onSuccess: (_, variables) => {
      const { gameId, userAddress } = variables;
      queryClient.invalidateQueries({
        queryKey: ['profile/guild', userAddress, gameId],
      });
      queryClient.invalidateQueries({ queryKey: ['guild', gameId] });
      queryClient.refetchQueries({ queryKey: ['guild', gameId] });
    },
  });

  return { joinGuild };
}
