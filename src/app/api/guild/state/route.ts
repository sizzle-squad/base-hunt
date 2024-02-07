import { Database } from '@/utils/database.types';
import {
  GuildScoreData,
  get5pmMstDateRangeFromCurrent,
  getGuildTxCounts,
} from '@/utils/guild/helpers';
import { toBigInt } from '@/utils/toBigInt';
import { createClient } from '@supabase/supabase-js';
import { err } from 'inngest/types';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);
// Fetch all guilds
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);
  // Get current date range
  const [from, to] = await get5pmMstDateRangeFromCurrent(new Date());
  const { data, error } = await supabase
    .from('guild_score')
    .select('id, guild_id,score')
    .gte('timestamp', from.toISOString())
    .lte('timestamp', to.toISOString())
    .returns<GuildScoreData[]>();

  if (error) {
    console.error(error);

    return new Response(`No guilds found with gameId: ${gameId}`, {
      status: 405,
    });
  }

  if (data?.length == 0) {
    return new Response('No guild scores found with gameId', { status: 405 });
  }

  const result = await getGuildTxCounts(data);

  return NextResponse.json(result);
}
