import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { Badge, BadgeTypeEnum } from '../../../../hooks/types';

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
  if (!userAddress || gameId == null) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  const { data, error } = await supabase.rpc('getbadgestate', {
    _game_id: gameId,
    _user_address: userAddress,
  });
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  console.log(data);
  //Note: remove duplicate badges from the same contract:tokenId
  const addressSet: Set<string> = new Set();
  let results: Badge[] = [];
  for (const d of data as any[]) {
    const key = d.j.contract_address + '::' + d.j.token_id;
    if (!addressSet.has(key)) {
      addressSet.add(key);
      results.push(mapToBadge(d.j));
    }
  }

  return NextResponse.json(results);
}

function mapToBadge(b: QueryData): Badge {
  return {
    id: b.id.toString(),
    name: b.name,
    description: '',
    imageUrl: new URL(b.image_url),
    isCompleted: b.to_address != null,
    type: b.type,
    txHash: b.transaction_hash,
    completedTimestamp: b.created_at,
    contractAddress: b.contract_address,
    tokenId: b.token_id,
    ctaText: b.cta_text,
    ctaUrl: b.cta_url,
  };
}

/*
database function:

create or replace function getBadgeState(
    _game_id bigint,
    _user_address text
) 
returns table ( j json ) 
language plpgsql
as $$
declare 

begin
 RETURN QUERY select to_json(temp) from (select b.id,b.name,b.image_url,b.contract_address,b.token_id,b.cta_url,b.cta_text,b.type,w.to_address,w.transaction_hash,w.created_at,w.event_type from badge_configuration as b LEFT join webhook_data as w
  on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = ('x'||lpad(trim( leading '0' from substring(w.value,3)),16,'0'))::bit(64)::bigint and LOWER(w.from_address) = LOWER(b.minter)
  and w.to_address ILIKE _user_address and b.game_id = _game_id) as temp;
end; 
$$


*/
