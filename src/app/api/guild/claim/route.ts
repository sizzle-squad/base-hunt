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

  console.log('claiming guild score');
  try {
    const gameIdNumber = parseInt(gameId as string);
    await supabase.rpc('guilduserclaim', {
      _game_id: gameIdNumber,
      _user_address: userAddress,
    });
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
    .eq('user_address', userAddress)
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
  console.log(guildMember);

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
  console.log(guildWinClaims);

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

  //TODO: make sure none of the claims have already been taken
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
};
