import { routes } from '@/constants/routes';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Badge, BadgeTypeEnum } from './types';
import { useMemo } from 'react';
import { sortWithBigInt } from '@/utils/sortWithBigInt';

type Props = {
  userAddress?: `0x${string}`;
  gameId: string;
};

type GameStateReturnType = {
  data: Badge[];
};

export function useGameState({ userAddress, gameId }: Props) {
  const { data, isLoading, error } = useQuery<GameStateReturnType>(
    ['profile/state', userAddress, gameId],
    async () => {
      return await axios({
        method: 'GET',
        url: `${routes.profile.state}?userAddress=${userAddress}&gameId=${gameId}`,
      });
    },
    {
      enabled: !!userAddress && gameId !== undefined,
      onError: (error) => {
        console.error(error);
        // Handle error appropriately
      },
    }
  );

  return useMemo(() => {
    const irlBadges =
      data?.data
        .filter((badge) => badge.type === BadgeTypeEnum.IRL)
        .sort((a, b) => sortWithBigInt(a.tokenId, b.tokenId)) || [];

    const onlineBadges =
      data?.data
        .filter((badge) => badge.type === BadgeTypeEnum.Online)
        .sort((a, b) => sortWithBigInt(a.tokenId, b.tokenId)) || [];

    const completedIRLBadgeCount = irlBadges.filter(
      (badge) => badge.isCompleted
    ).length;
    const completedOnlineBadgeCount = onlineBadges.filter(
      (badge) => badge.isCompleted
    ).length;

    return {
      data: {
        irlBadges,
        completedIRLBadgeCount,
        onlineBadges,
        completedOnlineBadgeCount,
        badges: data?.data || [],
      },
      isLoading,
      error,
    };
  }, [data?.data, error, isLoading]);
}
