import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { Guild } from '@/hooks/types';
import { GuildPostBodyData } from '@/hooks/useMutateGuild';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';
import { CheckFunctionType } from '@/utils/database.enums';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

// Fetch all guilds
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (gameId === null) {
    return new Response(`Missing parameters: gameId: ${gameId}`, {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from('guild_configuration')
    .select(`*`)
    .eq('game_id', BigInt(gameId));

  if (error) {
    return new Response(`No guilds found with gameId: ${gameId}`, {
      status: 400,
    });
  }

  const result: Guild[] = data.map((guild, index) => ({
    id: guild.guild_id,
    name: guild.name,
    gameId: guild.game_id,
    totalMemberCount: guild.total_member_count,
    leader: guild.leader,
    currentScore: 0, // TODO: add currentScore column in guild_configuration
    rank: index.toString(), // TODO: add getGuildRank function in supabase
  }));

  return NextResponse.json(result);
}

// Register a user to a guild
export async function POST(request: NextRequest) {
  const body: GuildPostBodyData = await request.json();
  const { gameId, userAddress, guildId } = body;

  if (!userAddress || !gameId || !guildId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, guildId: ${guildId}`,
      {
        status: 400,
      }
    );
  }

  const params = {
    user_address: userAddress.toLowerCase(),
    game_id: parseInt(gameId),
    guild_id: guildId,
  };

  //claim the join guild challenge
  const challengeData = await supabase
    .from('challenge_configuration')
    .select('id,points')
    .eq('game_id', gameId)
    .eq('type', CheckFunctionType.checkJoinGuild)
    .single();
  if (challengeData.error) {
    console.error(challengeData.error);
    return new NextResponse(`Error getting challenge data`, {
      status: 400,
    });
  }

  const { error } = await supabase
    .from('guild_member_configuration')
    .insert(params)
    .select();

  if (error) {
    console.error(error);

    return new Response(`Error: failed to join guild: ${guildId}`, {
      status: 400,
    });
  }

  const claimChallengeData = await supabase
    .from('user_challenge_status')
    .upsert(
      {
        user_address: params.user_address,
        challenge_id: challengeData.data.id,
        status: 'COMPLETE',
        points: challengeData.data.points,
        game_id: params.game_id,
      },
      {
        onConflict: 'game_id,user_address,challenge_id',
        ignoreDuplicates: true,
      }
    );

  if (claimChallengeData.error) {
    console.error(claimChallengeData.error);
    return new NextResponse(`Error claiming join challegne`, {
      status: 400,
    });
  }

  return NextResponse.json({ success: true });
}
