import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { createClient } from '@supabase/supabase-js';

import { toBigInt } from '@/utils/toBigInt';

type RankType = {
  rank: number;
  user_address: string;
  current_score: number;
};

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress');
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (!userAddress || gameId === null) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }
  const rankData = await supabase.rpc('getscorerank', {
    _game_id: gameId,
    _user_address: userAddress,
  });
  if (rankData.error) {
    console.log(rankData.error);
    return new Response('', { status: 500 });
  }
  const rank = rankData.data;
  if (rank.length === 0) {
    return NextResponse.json({
      rank: null,
      userAddress: userAddress,
      currentScore: 0,
    });
  }

  const playerRank = rank[0].j as RankType;

  const response = NextResponse.json({
    rank: playerRank?.rank.toString(),
    userAddress: playerRank?.user_address,
    currentScore: playerRank?.current_score,
  });

  // cache for 10 seconds
  response.headers.set('Cache-Control', 'public, s-maxage=10');
  response.headers.set('CDN-Cache-Control', 'public, s-maxage=10');
  response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=10');

  return response;
}

/*
database function:

create or replace function getscorerank(
    _game_id bigint,
    _user_address text
) 
returns table ( j json ) 
language plpgsql
as $$
declare 

begin
 RETURN QUERY  select to_json(temp.*) from (select rank() over (order by current_score desc, updated_at asc) as rank, 
    user_address as user_address, current_score from score where game_id = _game_id and user_address ilike _user_address)  as temp;
end; 
$$


$$

*/
