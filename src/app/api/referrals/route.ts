import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';
import { toBigInt } from '@/utils/toBigInt';

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
    const referralData = await supabase
      .from('user_referrals')
      .select()
      .eq('user_address', userAddress.toLowerCase())
      .eq('game_id', gameId);

    console.log(referralData);
    return NextResponse.json({ success: true, data: referralData.data });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
