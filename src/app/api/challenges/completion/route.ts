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

interface ChallengeConfigurationType {
  id: number;
  challenge_id: string;
}

interface UserChallengeStatusType {
  id: number;
  user_address: string;
  challenge_id: number;
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
    // Fetch challenge configuration based on challengeIds
    const { data: challengeConfigurations, error: configError } = await supabase
      .from('challenge_configuration')
      .select('*')
      .in('challenge_id', challengeIds);

    if (configError) {
      console.error(configError);
      return new Response('Error querying challenge configurations', {
        status: 500,
      });
    }

    if (!challengeConfigurations || challengeConfigurations.length === 0) {
      return NextResponse.json(
        {
          error: `No challenge configurations found for the provided challengeIds`,
        },
        { status: 400 }
      );
    }

    // Extract challenge IDs from fetched challenge configurations
    const challengeIdsFromConfigurations = challengeConfigurations.map(
      (config) => config.id
    );

    // Fetch user challenge status based on userAddress and the challenge IDs from configurations
    const { data: userChallengeStatusData, error: statusError } = await supabase
      .from('user_challenge_status')
      .select('*')
      .in('challenge_id', challengeIdsFromConfigurations)
      .eq('user_address', userAddress.toLowerCase());

    if (statusError) {
      console.error(statusError);
      return new Response('Error querying user challenge status', {
        status: 500,
      });
    }

    if (!userChallengeStatusData || userChallengeStatusData.length === 0) {
      return NextResponse.json([]);
    }

    let userChallengeStatusMap = new Map<number, UserChallengeStatusType>();
    userChallengeStatusData.forEach((userChallengeStatus) => {
      userChallengeStatusMap.set(
        userChallengeStatus.challenge_id,
        userChallengeStatus
      );
    });

    return NextResponse.json(
      mapToChallengeCompletionState(
        challengeConfigurations,
        userChallengeStatusMap
      )
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
  challengeConfigurations: ChallengeConfigurationType[],
  challengeConfigurationsMap: Map<number, UserChallengeStatusType>
): ChallengeCompletionState[] {
  return challengeConfigurations.map((challengeConfiguration) => {
    let userChallengeStatus = challengeConfigurationsMap.get(
      challengeConfiguration.id
    );
    return {
      id: challengeConfiguration.id,
      challengeId: challengeConfiguration.challenge_id,
      hasCompleted: userChallengeStatus
        ? userChallengeStatus.status === ChallengeStatus.COMPLETE
        : false,
    };
  });
}
