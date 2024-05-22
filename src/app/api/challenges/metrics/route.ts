import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { ChallengeMetricsState } from '@/hooks/types';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

interface ChallengeCompletionCountType {
  id: number;
  count: number;
  points: number;
  challenge_id: string;
  name: string;
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

    const challengeCompletionCountRes = await supabase.rpc(
      'get_challenge_completion_count',
      {
        _game_id: Number(gameId),
      }
    );
    if (challengeCompletionCountRes.error) {
      console.log(challengeCompletionCountRes.error);
      return new Response('', { status: 500 });
    }

    const challengeCompletionCount =
      challengeCompletionCountRes.data as unknown as ChallengeCompletionCountType[];

    return NextResponse.json(
      mapToChallengeMetricsState(challengeCompletionCount)
    );
  } catch (error) {
    return NextResponse.json(
      { error: `No available boosts found for gameId: ${gameId}` },
      { status: 400 }
    );
  }
}

function mapToChallengeMetricsState(
  challengeCompletionData: ChallengeCompletionCountType[]
): ChallengeMetricsState[] {
  return challengeCompletionData.map((challengeCompletion) => {
    return {
      id: challengeCompletion.id,
      challengeId: challengeCompletion.challenge_id,
      numCompletions: challengeCompletion.count,
      name: challengeCompletion.name,
      points: challengeCompletion.points,
    };
  });
}
