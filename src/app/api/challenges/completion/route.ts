import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { ChallengeCompletionState } from '@/hooks/types';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';
import { ChallengeStatus } from '@/utils/database.enums';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

interface UserChallengeStatusType {
  id: number;
  user_address: string;
  challenge_id: string;
  status: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);
  const userAddress = searchParams.get('userAddress') as string;
  const challengeIds = searchParams.get('challengeIds')?.split(',').map(String);

  if (!gameId || !userAddress || !challengeIds || challengeIds.length === 0) {
    return new Response(
      'Missing parameters: gameId, userAddress, or challengeIds',
      {
        status: 400,
      }
    );
  }

  try {
    // Fetch user challenge status based on userAddress and the challenge IDs from configurations
    const { data: userChallengeStatusData, error: statusError } = await supabase
      .from('user_challenge_status')
      .select('*')
      .in('challenge_id', challengeIds)
      .eq('user_address', userAddress.toLowerCase());

    if (statusError) {
      console.error(statusError);
      return new Response('Error querying user challenge status', {
        status: 500,
      });
    }

    let userChallengeStatusMap = new Map<string, UserChallengeStatusType>();
    userChallengeStatusData.forEach((userChallengeStatus) => {
      userChallengeStatusMap.set(
        userChallengeStatus.challenge_id,
        userChallengeStatus
      );
    });

    // add missing challenges with status NOT_STARTED
    challengeIds.forEach((challengeId) => {
      if (!userChallengeStatusMap.has(challengeId)) {
        userChallengeStatusData.push({
          id: 0,
          user_address: userAddress,
          challenge_id: challengeId,
          status: ChallengeStatus.NOT_STARTED,
          created_at: '',
          game_id: 0,
          points: 0,
        });
      }
    });

    return NextResponse.json(
      mapToChallengeCompletionState(userChallengeStatusData)
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: `An error occurred while fetching metrics for gameId: ${gameId} and userAddress: ${userAddress}`,
      },
      { status: 500 }
    );
  }
}

function mapToChallengeCompletionState(
  userChallengeData: UserChallengeStatusType[]
): ChallengeCompletionState[] {
  return userChallengeData.map((userChallenge) => {
    return {
      id: userChallenge.id,
      challengeId: userChallenge.challenge_id,
      hasCompleted: userChallenge.status === ChallengeStatus.COMPLETE,
    };
  });
}
