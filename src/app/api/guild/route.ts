import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';
import { GuildData } from '@/hooks/useGuild';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

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

  const gameIdInBigInt = toBigInt(gameId as string);
  const guildIdInBigInt = toBigInt(guildId as string);

  const params = {
    userAddress: userAddress,
    gameId: gameIdInBigInt,
    guildId: guildIdInBigInt,
  };

  console.log(params);
  const { error } = await supabase.rpc('upsertguild', params);
  if (error) {
    console.error(error);

    return new Response(`Error: failed to join guild: ${guildId}`, {
      status: 400,
    });
  }

  return NextResponse.json({ success: true });
}
