import { routes } from '@/constants/routes';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Boost, ChallengeDifficultyEnum } from './types';
import { useMemo } from 'react';
import Text from '@/components/Text';

import {
  WalletIcon,
  CoffeeIcon,
  BagIcon,
  GridIcon,
  CircleIcon,
  LinkIcon,
  UsersIcon,
} from '@/components/assets/icons/BoostIcon';
import { BoostEntry } from '@/app/(drawerPages)/badges/ChallengeClient';

const iconMapping = {
  WALLET: <WalletIcon />,
  COFFEE: <CoffeeIcon />,
  BAG: <BagIcon />,
  GRID: <GridIcon />,
  CIRCLE: <CircleIcon />,
  LINK: <LinkIcon />,
  USERS: <UsersIcon />,
};

type Props = {
  userAddress: `0x${string}` | undefined;
  gameId: string;
};

type ChallengesReturnType = Record<ChallengeDifficultyEnum, BoostEntry[]>;

export function useBoosts({ userAddress, gameId }: Props) {
  const { data, isLoading, error } = useQuery<ChallengesReturnType>(
    ['boosts', userAddress, gameId],
    async () => {
      const boosts = await axios({
        method: 'GET',
        url: `${routes.boosts.default}`,
        params: {
          userAddress: userAddress,
          gameId: gameId,
        },
      });

      // TODO: group by data.difficultyType
      const activeChallenges = boosts.data.filter(
        (boost: Boost) => boost.isEnabled
      );

      console.log({ activeChallenges });

      const groupedChallengesByType = activeChallenges.reduce(
        (acc: Record<string, BoostEntry[]>, boost: Boost) => {
          if (!boost.difficultyType) {
            return acc;
          }

          if (!acc[boost.difficultyType]) {
            acc[boost.difficultyType] = [];
          }

          const parsedBoost = {
            id: boost.id,
            title: boost.name,
            description: boost.description,
            type: boost.boostType,
            contractAddresses: boost.contractAddresses,
            subtitle: '',
            ctaUrl: boost.ctaUrl,
            ctaText: boost.ctaText,
            ctaButtonText: boost.ctaButtonText,
            points: boost.points,
            claimed: boost.claimed,
            claimable: !boost.claimed,
            startContent: iconMapping[boost.icon],
            endContent: <Text>{boost.points.toString()} pts</Text>,
          };

          acc[boost.difficultyType].push(parsedBoost);

          return acc;
        },
        {}
      );

      return groupedChallengesByType;
    },
    {
      enabled: !!userAddress && gameId !== undefined,
      onError: (error) => {
        console.error(error);
      },
    }
  );

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
    }),
    [data, error, isLoading]
  );
}
