import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import compact from 'lodash/compact';

import { Challenge } from '@/hooks/types';
import { ChallengeStatus } from '@/utils/database.enums';
import { Database, Tables } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

async function mapChallengeState(
  challenge: Tables<'challenge_configuration'>
): Promise<Challenge> {
  return {
    id: challenge.id,
    challengeId: challenge.challenge_id,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress') as string;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (!userAddress || gameId === null) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  const challengesData = await supabase
    .from('challenge_configuration')
    .select(`*, user_challenge_status (*)`)
    .eq('game_id', gameId)
    .eq('user_challenge_status.user_address', userAddress.toLowerCase());

  if (challengesData.error) {
    console.error(challengesData.error);
    throw new Error(challengesData.error.message);
  }

  const challengesFormatted: Promise<Challenge>[] = challengesData.data.map(
    async (challenge) => {
      const isCompleted = Boolean(
        challenge.user_challenge_status.length &&
          challenge.user_challenge_status[0].status === ChallengeStatus.COMPLETE
      );
      const mappedChallenge = await mapChallengeState(challenge);
      1;
      return { ...mappedChallenge, isCompleted };
    }
  );

  try {
    const formattedChallenges = await Promise.all(compact(challengesFormatted));

    return NextResponse.json(formattedChallenges);
  } catch (error) {
    return NextResponse.json(
      { error: `No available challenges found for gameId: ${gameId}` },
      { status: 400 }
    );
  }
}
