import axios from 'axios';
import { useMutation } from 'react-query';

import { routes } from '@/constants/routes';

export type OptInPostBodyType = {
  userAddress: `0x${string}` | undefined;
  gameId: string;
};

export function useMutateOptIn() {
  const optIn = useMutation((data: OptInPostBodyType) => {
    const { gameId, userAddress } = data;

    if (!userAddress || !gameId) {
      throw new Error(
        `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`
      );
    }

    return axios.post(routes.profile.optIn, data);
  });

  return { optIn };
}
