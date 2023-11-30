import { useMutation } from 'react-query';
import { routes } from '@/constants/routes';
import axios from 'axios';

export type BoostsClaimData = {
    gameId: string;
    userAddress: `0x${string}` | undefined;
    boostId: string;
    contractAddress?: string;
  };

export function useClaimBoost() {
    const claimBoost = useMutation({
      mutationFn: (data: BoostsClaimData) => { 
        const { gameId, userAddress, boostId } = data;

        if (!userAddress || !gameId || !boostId) {
            return new Response(
              `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, boostId: ${boostId}`,
              {
                status: 400,
              }
            );
          }
          
        return axios.post(routes.boosts.claim, data);
      },
    });
    return { claimBoost };
}