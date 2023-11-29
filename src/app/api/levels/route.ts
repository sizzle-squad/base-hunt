import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (gameId == null) {
    return new Response('Missing parameters: gameId', { status: 400 });
  }

  const { data, error } = await supabase
    .from('level_configuration')
    .select('*')
    .eq('game_id', gameId)
    .order('level', { ascending: true });

  if (error) {
    return new Response(`No top ranks found with gameId: ${gameId}`, {
      status: 400,
    });
  }

  const result = data.map((entry) => ({
    level: entry.level,
    name: entry.name,
    thresholdPoints: entry.threshold_points,
    description: entry.description ?? '',
  }));

  return NextResponse.json(result);
}
