import { useMutation, useQueryClient } from 'react-query';
import { routes } from '@/constants/routes';
import axios from 'axios';

export type BoostsClaimData = {
  gameId: string;
  userAddress: `0x${string}` | undefined;
  boostId: string;
  contractAddresses?: string[];
};

export function useClaimBoost() {
  const queryClient = useQueryClient();

  const claimBoost = useMutation(
    (data: BoostsClaimData) => {
      const { gameId, userAddress, boostId } = data;

      if (!userAddress || !gameId || !boostId) {
        throw new Error(
          `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, boostId: ${boostId}`
        );
      }

      return axios.post(routes.boosts.claim, data);
    },
    {
      onSuccess: (_, variables) => {
        const { userAddress, gameId } = variables;

        queryClient.invalidateQueries(['boosts', userAddress, gameId]);
        queryClient.invalidateQueries(['levels']);
      },
    }
  );
  return { claimBoost };
}
