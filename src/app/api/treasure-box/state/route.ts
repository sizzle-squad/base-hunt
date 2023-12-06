import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { TreasureBoxEntry } from '../../../../hooks/types';

import { createClient } from '@supabase/supabase-js';
import { toBigInt } from '@/utils/toBigInt';
import { eqDateWithTimeKey, nextEligibleTime } from '@/utils/timeKey';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

type QueryData = {
  id: bigint;
  user_address: string;
  created_at: string;
  game_id: bigint;
  total_hitpoints: bigint;
  tap_count: bigint;
  updated_at: string;
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

  const { data, error } = await supabase
    .from('treasure_box_entries')
    .select()
    .ilike('user_address', userAddress)
    .eq('game_id', gameId);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  if (data.length == 0) {
    return NextResponse.json({
      userAddress: userAddress,
      totalHitpoints: 0,
      updatedAt: null,
      gameId: gameId,
      tapCount: 0,
      createdAt: null,
      isCTAEligible: true,
      nextEligibleDate: new Date(),
    });
  }

  return NextResponse.json(mapToEntry(data[0]));
}

function mapToEntry(b: QueryData): TreasureBoxEntry {
  const isCTAEligible = !eqDateWithTimeKey(new Date(b.updated_at), new Date());
  let net;
  if (!isCTAEligible) {
    net = nextEligibleTime(new Date(b.updated_at));
  } else {
    net = new Date();
  }
  return {
    userAddress: b.user_address,
    totalHitpoints: b.total_hitpoints,
    updatedAt: new Date(b.updated_at),
    gameId: b.game_id,
    tapCount: b.tap_count,
    createdAt: new Date(b.created_at),
    isCTAEligible: isCTAEligible,
    nextEligibleDate: net,
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
 RETURN QUERY select to_json(temp) from (select b.id,b.name,b.image_url,b.contract_address,b.token_id,b.cta_url,b.cta_text,b.type,b.lat_lng,w.to_address,w.transaction_hash,w.created_at,w.event_type from badge_configuration as b LEFT join webhook_data as w
  on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = ('x'||lpad(trim( leading '0' from substring(w.value,3)),16,'0'))::bit(64)::bigint and LOWER(w.from_address) = LOWER(b.minter)
  and w.to_address ILIKE _user_address and b.game_id = _game_id) as temp;
end; 
$$


*/
