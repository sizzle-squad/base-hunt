import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

// return top 10 ranks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (gameId === null) {
    return new Response(`Missing parameters: gameId: ${gameId}`, {
      status: 400,
    });
  }
  const { data, error } = await supabase
    .from('score')
    .select('*')
    .eq('game_id', BigInt(gameId))
    .order('current_score', { ascending: false })
    .order('updated_at', { ascending: true })
    .limit(10);

  if (error) {
    return new Response(`No top ranks found with gameId: ${gameId}`, {
      status: 400,
    });
  }

  const result = data.map((entry) => ({
    updatedAt: entry.updated_at,
    gameId: entry.game_id,
    currentScore: entry.current_score,
    userAddress: entry.user_address,
  }));

  return NextResponse.json(result);
}
