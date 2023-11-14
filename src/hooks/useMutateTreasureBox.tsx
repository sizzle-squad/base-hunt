import { useMutation } from 'react-query';
import {
  TreasureBoxType,
  verifyTreasureBoxRequest,
} from '@/app/api/treasure-box/route';
import { routes } from '@/constants/routes';
import axios from 'axios';

export function useMutateTreasureBox() {
  const attackBox = useMutation({
    mutationFn: (data: TreasureBoxType) => {
      // make sure data is correct

      verifyTreasureBoxRequest(data);
      return axios.post(routes.treasureBox.default, data);
    },
  });

  return { attackBox };
}
