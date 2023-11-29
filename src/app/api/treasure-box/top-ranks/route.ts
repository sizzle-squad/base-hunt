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

  if (gameId == null) {
    return new Response(`Missing parameters: gameId: ${gameId}`, {
      status: 400,
    });
  }
  const { data, error } = await supabase
    .from('treasure_box_entries')
    .select('*')
    .eq('game_id', BigInt(gameId))
    .order('total_hitpoints', { ascending: false })
    .limit(10);

  if (error) {
    return new Response(`No top ranks found with gameId: ${gameId}`, {
      status: 400,
    });
  }

  const result = data.map((entry) => ({
    cbid: entry.cbid,
    createdAt: entry.created_at,
    gameId: entry.game_id,
    totalHitpoints: entry.total_hitpoints,
    userAddress: entry.user_address,
    tapCount: entry.tap_count,
    ensName: entry.ens_name,
  }));

  return NextResponse.json(result);
}
