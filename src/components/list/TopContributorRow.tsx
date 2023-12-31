import { PlayerRank } from '@/hooks/types';
import LeaderBoardRow from './LeaderboardRow';

type Props = {
  rank: PlayerRank;
};

export function topContributorRow({ rank }: Props) {
  return <LeaderBoardRow rank={rank} position={1} offset={0} />;
}
