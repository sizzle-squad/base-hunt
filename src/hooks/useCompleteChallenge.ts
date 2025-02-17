import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { routes } from '@/constants/routes';

export type ChallengeData = {
  gameId: string;
  userAddress: `0x${string}` | undefined;
  challengeId: string;
  contractAddress?: string | null;
};

export function useCompleteChallenge() {
  const queryClient = useQueryClient();

  const claimChallenge = useMutation({
    mutationFn: (data: ChallengeData) => {
      const { gameId, userAddress, challengeId } = data;

      if (!userAddress || !gameId || !challengeId) {
        throw new Error(
          `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, challengeId: ${challengeId}`
        );
      }

      return axios.post(routes.challenges.complete, data);
    },
    onSuccess: (_, variables) => {
      const { userAddress, gameId } = variables;

      queryClient.invalidateQueries({
        queryKey: ['challenges', userAddress, gameId],
      });

      queryClient.refetchQueries({
        queryKey: ['levels'],
      });
    },
  });
  return { claimChallenge };
}
