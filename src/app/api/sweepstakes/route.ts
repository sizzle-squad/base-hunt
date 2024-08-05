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
  const userAddress = searchParams.get('userAddress') as string;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  console.log('GET /api/sweepstakes/is-opt-in', { userAddress, gameId });

  if (!userAddress || gameId === null) {
    return new NextResponse(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.rpc('get_is_opt_in_sweepstakes', {
      _game_id: gameId,
      _user_address: userAddress.toLowerCase(),
    });

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    console.log('GET /api/sweepstakes/is-opt-in', { data });

    const response = NextResponse.json({ isOptedIn: data });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
