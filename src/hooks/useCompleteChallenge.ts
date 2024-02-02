import { useMutation, useQueryClient } from 'react-query';
import { routes } from '@/constants/routes';
import axios from 'axios';

export type ChallengeData = {
  gameId: string;
  userAddress: `0x${string}` | undefined;
  challengeId: string;
  contractAddresses?: string[];
};

export function useCompleteChallenge() {
  const queryClient = useQueryClient();

  const claimBoost = useMutation(
    (data: ChallengeData) => {
      const { gameId, userAddress, challengeId } = data;

      if (!userAddress || !gameId || !challengeId) {
        throw new Error(
          `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, challengeId: ${challengeId}`
        );
      }

      return axios.post(routes.challenges.complete, data);
    },
    {
      onSuccess: (_, variables) => {
        const { userAddress, gameId } = variables;

        queryClient.invalidateQueries(['challenges', userAddress, gameId]);
        queryClient.invalidateQueries(['levels']);
      },
    }
  );
  return { claimBoost };
}
