import { createClient } from '@supabase/supabase-js';
import { err } from 'inngest/types';
import { NextRequest, NextResponse } from 'next/server';

import { Database } from '@/utils/database.types';
import {
  get5pmMstDateRangeFromCurrent,
  getGuildTxCounts,
  GuildScoreData,
} from '@/utils/guild/helpers';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);
// Fetch all guilds
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (gameId === null) {
    return new Response(`No gameId found`, {
      status: 405,
    });
  }
  // Get current date range
  const [from, to] = await get5pmMstDateRangeFromCurrent(new Date());
  const { result, error } = await getGuildRanks(gameId, from, to);
  if (error) {
    return new Response(`Error getting guilds: ${error}`, {
      status: 400,
    });
  }

  return NextResponse.json(result);
}

export async function getGuildRanks(
  gameId: bigint,
  from: Date,
  to: Date
): Promise<{
  result?: [string, number][];
  error?: Error;
}> {
  // Get current date range
  const { data, error } = await supabase
    .from('guild_score')
    .select('id, guild_id,score')
    .gte('timestamp', from.toISOString())
    .lte('timestamp', to.toISOString())
    .returns<GuildScoreData[]>();

  if (error) {
    console.error(error);
    return { error: new Error(`No guilds found with gameId: ${gameId}`) };
  }

  const result = await getGuildTxCounts(data);

  const guildsData = await supabase
    .from('guild_configuration')
    .select('*')
    .eq('game_id', gameId);

  if (guildsData.error) {
    return { error: new Error(`Unable to retrieve guilds: ${gameId}`) };
  }

  for (let i = 0; i < guildsData.data.length; i++) {
    if (!result.hasOwnProperty(guildsData.data[i].guild_id)) {
      result[guildsData.data[i].guild_id] = 0;
    }
  }
  const sorted = Object.entries(result).sort((a, b) => b[1] - a[1]);
  return { result: sorted };
}
