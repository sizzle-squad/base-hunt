import { routes } from '@/constants/routes';
import axios from 'axios';
import { useMutation } from 'react-query';

type Props = {
  userAddress: `0x${string}` | string;
  gameId: string;
  guildId: string;
};

export type GuildPostBodyData = {
  userAddress: `0x${string}` | undefined;
  gameId: string;
  guildId: string;
};

export function useMutateGuild() {
  const joinGuild = useMutation((data: GuildPostBodyData) => {
    const { gameId, userAddress, guildId } = data;

    if (!userAddress || !gameId || !guildId) {
      throw new Error(
        `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, guildId: ${guildId}`
      );
    }

    return axios.post(routes.guild.default, data);
  });

  return { joinGuild };
}
