'use client';

import { GAME_ID } from '@/constants/gameId';
import { useClientCheck } from '@/hooks/useClientCheck';
import { useGameState } from '@/hooks/useGameState';
import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';

type Props = {
  params: { id: string };
};

export default function BadgeDetailPage({ params }: Props) {
  const { address } = useAccount();
  const isClient = useClientCheck();
  const { id } = params;
  const { data, isLoading, error } = useGameState({
    userAddress: address,
    gameId: GAME_ID,
  });

  const { badges } = data;

  const currentBadge = useMemo(() => {
    if (!badges) return null;
    return badges.find((badge) => badge.id === id);
  }, [badges, id]);

  const BadgeWrapper = useMemo(() => {
    if (!isClient) return null;

    return (
      <>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error...</div>}
        {currentBadge && (
          <>
            <div>{currentBadge.name}</div>
            <div>{currentBadge.description}</div>
            <div>{currentBadge.imageUrl.toString()}</div>
          </>
        )}
      </>
    );
  }, [isClient, isLoading, error, currentBadge]);
  return BadgeWrapper;
}
