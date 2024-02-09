import { type NextRequest, NextResponse } from 'next/server';

import '@/utils/helper';
import { createClient } from '@supabase/supabase-js';
import { getTapRef } from '@/utils/iyk';

import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

const PHYSICAL_TAP_MULTIPLIER = parseFloat(
  process.env.PHYSICAL_TAP_MULTIPLIER as string
) as number;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const iykRef = searchParams.get('iykRef');
  const userAddress = searchParams.get('userAddress');
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (!userAddress || gameId === null || !iykRef) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, iykRef: ${iykRef}`,
      {
        status: 400,
      }
    );
  }
  const result = await getTapRef(iykRef as string);
  if (result === null || !result.isValidRef) {
    return new Response(`Invalid tapRef: ${iykRef}`, {
      status: 403,
    });
  }

  let scoreData = (await supabase
    .from('score')
    .select()
    .ilike('user_address', userAddress)
    .eq('game_id', gameId)) as any;

  if (scoreData.error) {
    console.error(scoreData.error);
    throw new Error(scoreData.error.message);
  }
  const score = scoreData.data[0];

  if (!score) {
    return new Response('Error: score not found', { status: 400 });
  }
  const params = {
    _game_id: gameId,
    _user_address: userAddress,
    _cbid: '',
    _ens_name: '',
    _increment: Math.round(score.current_score * PHYSICAL_TAP_MULTIPLIER),
    _tap_count: BigInt(1),
  };
  console.log(params);
  const { error } = await supabase.rpc('upserttreasurebox', params);
  if (error) {
    console.error(error);
    return new Response('Error: failed to register treasure box entry', {
      status: 400,
    });
  }
  return NextResponse.json({ status: 'ok' });
}
