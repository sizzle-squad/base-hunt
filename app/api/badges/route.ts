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

  if (!gameId || !walletAddress) {
    return new Response('Missing parameters', { status: 400 });
  }

  return new Response(JSON.stringify(MOCK_BADGES), {
    headers: { 'content-type': 'application/json' },
  });
}
