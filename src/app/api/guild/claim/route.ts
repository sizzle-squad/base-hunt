import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

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
  const userAddress = (searchParams.get('userAddress') as string).toLowerCase();
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (!userAddress || gameId === null) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  const { result, error } = await getClaimablev2(gameId, userAddress);
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

  let gameIdNumber;
  try {
    gameIdNumber = parseInt(gameId as string);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false });
  }

  if (gameIdNumber === undefined) {
    console.error(`invalid gameIdNumber ${gameId}`);
    return NextResponse.json({ success: false });
  }

  const { data, error } = await supabase.rpc('guilduserclaim', {
    _game_id: gameIdNumber,
    _user_address: userAddress.toLowerCase(),
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}

export type UserGuildScoreClaimable = {
  claimablePoints: number;
  claimedPoints: number;
};

export async function getClaimablev2(
  gameId: bigint,
  userAddress: string
): Promise<{
  result?: {
    claimable: Claimable[];
    claimed: Claimable[];
  };
  error?: Error;
}> {
  const guildMemberData = await supabase
    .from('guild_member_configuration')
    .select('guild_id,created_at')
    .eq('game_id', gameId)
    .eq('user_address', userAddress.toLowerCase())
    .maybeSingle();
  if (guildMemberData.error) {
    return { error: new Error(guildMemberData.error.message) };
  }
  const guildMember = guildMemberData.data;
  if (!guildMember) {
    return {
      result: {
        claimable: [],
        claimed: [],
      },
    };
  }

  const guildWinClaimsData = await supabase
    .from('guild_win')
    .select('*')
    .eq('game_id', gameId)
    .eq('guild_id', guildMember.guild_id)
    .gt('to', guildMember.created_at);

  if (guildWinClaimsData.error) {
    return { error: new Error(guildWinClaimsData.error.message) };
  }
  const guildWinClaims = guildWinClaimsData.data;

  const guildUserClaimData = await supabase
    .from('guild_user_claim')
    .select()
    .eq('game_id', gameId)
    .eq('user_address', userAddress.toLowerCase())
    .eq('guild_id', guildMember.guild_id)
    .returns<Claimable[]>();

  if (guildUserClaimData.error) {
    return { error: new Error(guildUserClaimData.error.message) };
  }

  const guildUserClaim = guildUserClaimData.data;
  const alreadyClaimed = guildUserClaim.reduce(
    (acc: Record<string, Claimable>, claim: Claimable) => {
      acc[claim.claim_id] = claim;
      return acc;
    },
    {}
  );
  const result = guildWinClaims.reduce(
    (
      acc: {
        claimable: Claimable[];
        claimed: Claimable[];
      },
      curr: Claimable
    ) => {
      if (alreadyClaimed.hasOwnProperty(curr.claim_id)) {
        acc.claimed.push(curr);
        return acc;
      }
      acc.claimable.push(curr);
      return acc;
    },
    { claimable: [], claimed: [] }
  );

  return { result: result };
}

export type Claimable = {
  claim_id: number;
  created_at: string;
  from: string;
  game_id: number;
  guild_id: string;
  id: number;
  score: number;
  to: string;
  points: number;
};
