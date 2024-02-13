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
  process.env.SUPABASE_ANON_KEY as string
);

export type ContentDataType = {
  icon: string;
  description: string;
  image_url: string | null;
  game_id: bigint;
  cta_url: string | null;
  cta_text: string | null;
  cta_button_text: string | null;
};

async function mapChallengeState(
  challenge: Tables<'challenge_configuration'>
): Promise<Challenge> {
  // forced to use unknown because of lack of support in Supabase type mapping
  const {
    icon,
    description,
    image_url,
    game_id,
    cta_url,
    cta_text,
    cta_button_text,
  } = challenge.content_data as unknown as ContentDataType;

  return {
    id: challenge.id,
    name: challenge.display_name,
    contractAddress: challenge.contract_address,
    icon,
    description,
    imageUrl: image_url,
    gameId: game_id as bigint,
    ctaUrl: cta_url,
    ctaText: cta_text,
    ctaButtonText: cta_button_text,
    challengeType: challenge.type,
    isEnabled: challenge.is_enabled,
    points: challenge.points,
    type: challenge.type,
    checkFunction: challenge.function_type,
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
    .select(
      `
    *,
    user_challenge_status (
      *
    )
  `
    )
    .eq('game_id', gameId)
    .eq('is_enabled', true)
    .eq('user_challenge_status.user_address', userAddress.toLowerCase());

  if (challengesData.error) {
    console.error(challengesData.error);
    throw new Error(challengesData.error.message);
  }

  // const challengesFormatted: Promise<Challenge>[] = challengesData.data.map(
  //   async (challenge) => {
  //     const isCompleted = Boolean(
  //       challenge.user_challenge_status.length &&
  //         challenge.user_challenge_status[0].status === ChallengeStatus.COMPLETE
  //     );
  //     const mappedChallenge = await mapChallengeState(challenge);
  //     1;
  //     return { ...mappedChallenge, isCompleted };
  //   }
  // );

  try {
    // const formattedChallenges = await Promise.all(compact(challengesFormatted));
    // formattedChallenges.sort((a: Challenge, b: Challenge) => {
    //   if (a.isCompleted === b.isCompleted) {
    //     return a.points - b.points; // Sort by points in ascending order if isClaimed is equal
    //   }
    //   return a.isCompleted ? 1 : -1;
    // });

    return NextResponse.json(challengesData.data);
  } catch (error) {
    return NextResponse.json(
      { error: `No available boosts found for gameId: ${gameId}` },
      { status: 400 }
    );
  }
}
