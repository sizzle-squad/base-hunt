import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';
import { GuildData } from '@/hooks/useMutateGuild';
import { Guild } from '@/hooks/types';

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
  const body: GuildData = await request.json();
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
    user_address: userAddress,
    game_id: parseInt(gameId),
    guild_id: guildId,
  };

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

  return NextResponse.json({ success: true });
}
