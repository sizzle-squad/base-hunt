import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { createClient } from '@supabase/supabase-js';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (gameId === null) {
    return new Response(`Missing parameter: gameId: ${gameId}`, {
      status: 400,
    });
  }

  try {
    const referralData = await supabase.rpc('get_top_referrers', {
      _game_id: gameId,
    });
    return NextResponse.json({ success: true, data: referralData.data });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
