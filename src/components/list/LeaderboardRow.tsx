import { ReactNode } from 'react';
import { useCBProfile } from '@/hooks/useCBProfile';
import { useUserName } from '@/hooks/useUsername';

import ListRow from './ListRow';

type Props = {
  position: number;
  offset: number;
  isLast?: boolean;
  score: number;
  name: string;
  startContent?: ReactNode;
  rounded?: boolean;
};

export default function LeaderBoardRow({
  position,
  offset,
  isLast,
  score,
  name,
  startContent,
  rounded,
}: Props) {
  const { data: userPublicProfile, isLoading } = useCBProfile({
    address: name as '0x${string}',
  });
  const displayName =
    useUserName({
      address: name as '0x${string}',
      userPublicProfile,
    }) ?? name;

  return (
    <ListRow
      {...{
        position,
        offset,
        isLast,
        isLoading,
        name: displayName,
        score,
        startContent,
        rounded,
      }}
    />
  );
}
