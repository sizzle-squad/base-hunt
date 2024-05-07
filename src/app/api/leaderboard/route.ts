import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
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
  const page = parseInt(searchParams.get('page') || '1', 10);
  let perPage = parseInt(searchParams.get('perPage') || '100', 10);

  // Limit per page to 200
  perPage = Math.min(perPage, 200);

  if (gameId === null) {
    return new Response(`Missing parameters: gameId: ${gameId}`, {
      status: 400,
    });
  }
  
  const offset = (page - 1) * perPage;

  const { data, error } = await supabase
    .from('score')
    .select('*')
    .eq('game_id', BigInt(gameId))
    .order('current_score', { ascending: false })
    .order('updated_at', { ascending: true })
    .range(offset, offset + perPage - 1);

  if (error) {
    return new Response(`No top ranks found with gameId: ${gameId}`, {
      status: 400,
    });
  }

  const result = data.map((entry) => ({
    updatedAt: entry.updated_at,
    gameId: entry.game_id,
    currentScore: entry.current_score,
    userAddress: entry.user_address,
  }));

  const response = NextResponse.json(result);

  // cache for 10 seconds
  response.headers.set('Cache-Control', 'public, s-maxage=10');
  response.headers.set('CDN-Cache-Control', 'public, s-maxage=10');
  response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=10');

  return response;
}
