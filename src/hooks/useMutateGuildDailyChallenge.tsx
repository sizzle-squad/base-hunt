import axios from 'axios';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routes } from '@/constants/routes';

export type GuildDailyChallengePostBodyData = {
  userAddress: `0x${string}` | undefined;
  gameId: string;
};

export function useMutateGuildDailyChallenge() {
  const queryClient = useQueryClient();

  const claimDailyChallenge = useMutation({
    mutationFn: (data: GuildDailyChallengePostBodyData) => {
      const { gameId, userAddress } = data;

      if (!userAddress || !gameId) {
        throw new Error(
          `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`
        );
      }

      return axios.post(routes.guild.claim, data);
    },
    onSuccess: (_, data) => {
      const { gameId, userAddress } = data;
      queryClient.invalidateQueries({
        queryKey: ['profile/guild', userAddress, gameId],
      });
    },
  });

  return { claimDailyChallenge };
}
