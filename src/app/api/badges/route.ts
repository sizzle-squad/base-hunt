import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { BadgeState, ChallengeMetricsState } from '@/hooks/types';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

interface BadgeDataType {
  badge_id: number;
  badge_name: string;
  challenge_id: string;
  function_type: string;
  type: string;
}
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);
  try {
    if (gameId === null) {
      return new Response(`Missing parameters: gameId: ${gameId}`, {
        status: 400,
      });
    }

    const badgeDataRes = await supabase.rpc(
      'get_all_badges',
      {
        _game_id: Number(gameId),
      }
    );
    if (badgeDataRes.error) {
      console.log(badgeDataRes.error);
      return new Response('', { status: 500 });
    }

    const badgeData = badgeDataRes.data as unknown as BadgeDataType[];

    return NextResponse.json(
      mapToBadgeState(badgeData)
    );
  } catch (error) {
    return NextResponse.json(
      { error: `No available boosts found for gameId: ${gameId}` },
      { status: 400 }
    );
  }
}

function mapToBadgeState(
  badgeData: BadgeDataType[]
): BadgeState[] {
  return badgeData.map((badgeDataItem) => {
    return {
      badgeId: badgeDataItem.badge_id,
      badgeName: badgeDataItem.badge_name,
      challengeId: badgeDataItem.challenge_id,
      checkFunction: badgeDataItem.function_type,
      challengeType: badgeDataItem.type,
    };
  });
}
