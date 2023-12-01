import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { BadgeTypeEnum, Level } from '../../../../hooks/types';
import { createClient } from '@supabase/supabase-js';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

type QueryData = {
  id: bigint;
  name: string;
  image_url: string;
  to_address: string;
  type: BadgeTypeEnum;
  transaction_hash: string;
  created_at: Date;
  contract_address: string;
  token_id: bigint;
  cta_text: string;
  cta_url: string;
};
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
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

  const { data, error } = await supabase.rpc('getlevelstate', {
    _game_id: gameId,
    _user_address: userAddress,
  });
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const levels = data.map((d: any) => {
    return { ...d.j, isClaimed: d.j.transaction_hash !== null };
  });

  levels.sort((a: any, b: any) => {
    return a.level - b.level;
  });
  let currentLevelIdx = null;
  for (var i = levels.length - 1; i >= 0; i--) {
    if (levels[i].isClaimed) {
      currentLevelIdx = i;
      break;
    }
  }

  return NextResponse.json({
    levels: levels,
    currentLevelIdx: currentLevelIdx,
  } as LevelData);
}

export type LevelData = {
  levels: [];
  currentLevelIdx: number | null;
};

/*
database function:

create or replace function getLevelState(
    _game_id bigint,
    _user_address text
) 
returns table ( j json ) 
language plpgsql
as $$
declare 

begin
 RETURN QUERY select to_json(temp) from (select * from level_configuration as  l LEFT join level_data as d
  on LOWER(l.contract_address) = LOWER(d.contract_address) and l.token_id::bigint = ('x'||lpad(trim( leading '0' from substring(d.value,3)),16,'0'))::bit(64)::bigint and LOWER(l.minter) = LOWER(d.from_address)  
  and d.to_address = LOWER(_user_address) and l.game_id = _game_id) as temp;
end; 
$$




*/
