import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { createClient } from '@supabase/supabase-js';
import { toBigInt } from '@/utils/toBigInt';

import { ProfileStateV2 } from '../../../../hooks/types';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
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

  try {
    const { data: optInData, error } = await supabase
      .from('user_address_opt_in')
      .select()
      .eq('user_address', userAddress.toLowerCase())
      .eq('game_id', gameId);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    if (optInData.length === 0) {
      return NextResponse.json(mapToProfileStateV2(BigInt(100), false));
    }

    const { data: scoreData, scoreError } = await supabase
      .from('score')
      .select()
      .eq('user_address', userAddress.toLowerCase())
      .eq('game_id', gameId);

    if (scoreError) {
      console.error(error);
      throw new Error(error.message);
    }

    const score = scoreData[0];
    const currentScore = score ? score.current_score : BigInt(0);

    const response = NextResponse.json(
      mapToProfileStateV2(currentScore, optInData[0].played_ocs)
    );

    return response;
  } catch (e) {
    console.error(e);
    NextResponse.error();
  }
}

function mapToProfileStateV2(
  currentScore: bigint,
  playedOCS: boolean
): ProfileStateV2 {
  return {
    currentScore: currentScore,
    playedOCS: playedOCS,
  };
}
