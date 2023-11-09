'use client';

import { useBadges } from '@/hooks/useBadges';
import { useClientCheck } from '@/hooks/useClientCheck';
import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';

export default function BadgeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { address, isConnected } = useAccount();
  const isClient = useClientCheck();
  const { useGetBadge } = useBadges({ address, isConnected });
  const id = params.id;
  const { data: badge, isLoading, error } = useGetBadge({ badgeId: id });

  const BadgeWrapper = useMemo(() => {
    if (!isClient) return null;

    return (
      <>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error...</div>}
        {badge && (
          <>
            <div>{badge.name}</div>
            <div>{badge.description}</div>
            <div>{badge.imageUrl}</div>
          </>
        )}
      </>
    );
  }, [isClient, isLoading, error, badge]);
  return BadgeWrapper;
}
