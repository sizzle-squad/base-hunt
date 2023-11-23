import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';

type RankType = {
  rank: number;
  user_address: string;
};

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress');
  const gameId = searchParams.get('gameId');

  if (!userAddress || !gameId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }
  const rankData = await supabase.rpc('getuserrank', {
    _game_id: BigInt(gameId),
    _user_address: userAddress,
  });
  if (rankData.error) {
    console.log(rankData.error);
    return new Response('', { status: 500 });
  }
  const rank = rankData.data;
  if (rank.length === 0) {
    return NextResponse.json({
      rank: '0',
      userAddress: userAddress,
    });
  }

  const playerRank = rank[0].j as RankType;
  return NextResponse.json({
    rank: playerRank?.rank.toString(),
    userAddress: playerRank?.user_address,
  });
}

/*
database function:

create or replace function getUserRank(
    _game_id bigint,
    _user_address text
) 
returns table ( j json ) 
language plpgsql
as $$
declare 

begin
 RETURN QUERY select to_json(temp.*) from (select rank() over (order by total_hitpoints desc) as rank, 
    user_address as user_address from treasure_box_entries where game_id = _game_id) as temp where user_address ILIKE _user_address;
end; 
$$

*/
