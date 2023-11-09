import { type NextRequest } from 'next/server';
import { Badge } from '@/hooks/types';
import { MOCK_BADGES } from '@/utils/mock/badges';

export type BadgeData = {
  irlBadges: Badge[];
  onlineBadges: Badge[];
};

export type GetBadgesResponse = {
  data: BadgeData;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = searchParams.get('gameId');
  const walletAddress = searchParams.get('walletAddress');
  const badgeId = searchParams.get('badgeId');

  if (!gameId || !walletAddress || !badgeId) {
    return new Response('Missing parameters', { status: 400 });
  }

  // get badge from MOCK_BADGES
  const filteredBadges = [
    ...MOCK_BADGES.data.irlBadges,
    ...MOCK_BADGES.data.onlineBadges,
  ].filter((badge) => badge.id === badgeId);

  if (filteredBadges.length === 0) {
    return new Response('Badge not found', { status: 404 });
  }

  return new Response(JSON.stringify(filteredBadges[0]), {
    headers: { 'content-type': 'application/json' },
  });
}
