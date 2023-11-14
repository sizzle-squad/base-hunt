import { useMutation } from 'react-query';

// TODO: get types from API
type UserPublicProfileType = {
  address: `0x${string}`;
  cbId: string;
  ensName: string;
};

type Props = {
  gameId: string;
  points: string;
  user: UserPublicProfileType;
};

export function useMutateTreasureBox({ gameId, points, user }: Props) {
  const attackBox = useMutation({
    mutationFn: (data) => {
      // make sure data is correct
      return axios.post('');
    },
  });
}
