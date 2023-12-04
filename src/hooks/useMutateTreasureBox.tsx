import { useMutation, useQueryClient } from 'react-query';
import { TreasureBoxType } from '@/app/api/treasure-box/route';
import { routes } from '@/constants/routes';
import axios from 'axios';
import { verifyTreasureBoxRequest } from '@/utils/verifyTreasureBoxRequest';

export function useMutateTreasureBox({ gameId }: { gameId: string }) {
  const queryClient = useQueryClient();
  const attackBox = useMutation({
    mutationFn: (data: TreasureBoxType) => {
      // make sure data is correct

      verifyTreasureBoxRequest(data);
      return axios.post(routes.treasureBox.default, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['treasure-box', gameId]);
    },
  });

  return { attackBox };
}
