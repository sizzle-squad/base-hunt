import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { Badge, BadgeTypeEnum } from '../../../../hooks/types';

import { createClient } from '@supabase/supabase-js';

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
  const gameId = BigInt(searchParams.get('gameId') as string);

  const { data, error } = await supabase.rpc('getlevelstate', {
    _game_id: gameId,
    _user_address: userAddress,
  });
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  console.log(data);
  return NextResponse.json(data.map((d: any) => d.j));
}

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
