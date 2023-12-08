import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (gameId === null) {
    return new Response(
      `Missing parameters: gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  const badgeData = await supabase
    .from('badge_configuration')
    .select('description, artist_name, lat_lng, type, game_id, image_url, token_id, contract_address, name')
    .eq('game_id', gameId)

  if (badgeData.error) {
    console.error(badgeData.error);
    throw new Error(badgeData.error.message);
  }

  const badges = badgeData.data;

  return NextResponse.json(badges);
}