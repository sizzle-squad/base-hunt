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

export async function GET(prequest: NextRequest) {
  const searchParams = prequest.nextUrl.searchParams;
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

  const { result, error } = await getUserClaimData(gameId, userAddress);
  if (error) {
    return new Response(`Error getting user guild scores: ${error}`, {
      status: 400,
    });
  }

  return NextResponse.json(result);
}

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
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false });
  }
  return NextResponse.json({ success: true });
}

export type UserGuildScoreClaimable = {
  claimablePoints: number;
  claimedPoints: number;
};

export async function getUserClaimData(
  gameId: bigint,
  userAddress: string
): Promise<{
  result?: UserGuildScoreClaimable;
  error?: Error;
}> {
  const { data, error } = await supabase
    .from('user_guild_score_claim')
    .select()
    .eq('user_address', userAddress.toLowerCase())
    .eq('game_id', gameId);

  if (error) {
    return {
      error: new Error(`No guilds found with gameId: ${gameId}`),
    };
  }

  const claimablePoints = data
    .filter((x) => !x.is_claimed)
    .reduce((acc, curr) => {
      return acc + curr.points;
    }, 0);
  const claimedPoints = data
    .filter((x) => x.is_claimed)
    .reduce((acc, curr) => {
      return acc + curr.points;
    }, 0);

  return {
    result: {
      claimablePoints: claimablePoints,
      claimedPoints: claimedPoints,
    },
  };
}
