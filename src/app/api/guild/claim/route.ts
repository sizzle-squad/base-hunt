import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';
import { airdropNft } from '@/utils/walletapi';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export type GuildClaimData = {
  userAddress: `0x${string}` | undefined;
  gameId: string;
};

export async function POST(request: NextRequest) {
  const body: GuildClaimData = await request.json();
  const { userAddress, gameId } = body;

  if (!userAddress || gameId === undefined) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  console.log('claiming guild score');
  try {
    const gameIdBigInt = parseInt(gameId as string);
    await supabase
      .rpc('user_claim_guild_score', {
        _game_id: gameIdBigInt,
        _user_address: userAddress.toLowerCase(),
      })
      .select();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false });
  }
  return NextResponse.json({ success: true });
}
