import { NextResponse } from 'next/server';
import '@/utils/helper';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/utils/database.types';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

/*
curl -X POST 'http://localhost:3000/api/webhook/claim' -d ' {"type":"INSERT","table":"webhook_data","record":{"value":"0x0000000000000000000000000000000000000000000000000000000000000002","log_index":"0x0","block_hash":"0x7b247ffeae4605413ae1729d51f0c5c8ad4df8f92e18cdfeedbf2a44bb391f8f","created_at":"2023-11-08T09:01:57.114+00:00","event_type":"EVENT_TYPE_TRANSFER_ERC1155","network_id":"networks/base-goerli-testnet","to_address":"0xa14a25930babc1220df002070be86b030b1d4c68","from_address":"0x4c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d5","block_timestamp":"seconds:1699434114","contract_address":"0x68814e0f414b8fbcf984d3af85edfa365ef7254c","transaction_hash":"0x67b0c7879ea1821a5ff8e68ce43b48be98fab6f27addc9db3c51cce534513629","is_to_address_cbw":true,"is_from_address_cbw":true},"schema":"public","old_record":null}'  -H 'Content-Type: application/json'
*/
export async function POST(req: Request) {
  const body = await req.json();
  console.log('[webhook claim] body:', body);
  const badgeData = await supabase
    .from('badge_configuration')
    .select()
    .ilike('contract_address', body.record.contract_address)
    .eq('token_id', BigInt(body.record.value))
    .ilike('minter', body.record.from_address)
    .single();
  if (badgeData.error) {
    console.error(badgeData.error);
    throw new Error(badgeData.error.message);
  }
  const badge = badgeData.data;
  if (badge.type === 'level') {
    console.log('[webhook claim] skipping level badge');
    return NextResponse.json({});
  }
  console.log('[webhook claim] badge:', badge);

  //get current badges from db
  let rpcData = await supabase.rpc('getbadges', {
    _game_id: badge.game_id,
    _user_address: body.record.to_address.toLowerCase(),
  });
  if (rpcData.error) {
    console.error(rpcData.error);
    throw new Error(rpcData.error.message);
  }
  const badges = rpcData.data;
  console.log('[webhook claim] badges:', badges);

  rpcData = await supabase.rpc('gettransfernftboosts', {
    _game_id: badge.game_id,
    _num_badges: badges.length,
    _user_address: body.record.to_address.toLowerCase(),
  });

  if (rpcData.error) {
    console.error(rpcData.error);
    throw new Error(rpcData.error.message);
  }
  const unclaimedTransferBoosts = rpcData.data;

  console.log(
    '[webhook claim] unclaimedTransferBoosts:',
    unclaimedTransferBoosts
  );

  if (unclaimedTransferBoosts.length > 0) {
    console.log('[webhook claim] inserting unclaimedTransferBoosts');
    const { error } = await supabase.from('claimed_boost').insert(
      unclaimedTransferBoosts.map((b: any) => ({
        boost_id: b.j.id,
        user_address: body.record.to_address.toLowerCase(),
        game_id: badge.game_id,
      }))
    );
    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  return NextResponse.json({});
}

/*

###database functions:

create or replace function getBadges(
    _game_id bigint,
    _user_address text
) 
returns table ( j json ) 
language plpgsql
as $$
declare 

begin
 RETURN QUERY select to_json(temp) from (select DISTINCT b.contract_address,b.token_id,b.game_id,b.points from badge_configuration as b join webhook_data as w
      on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = ('x'||lpad(trim( leading '0' from substring(w.value,3)),16,'0'))::bit(64)::bigint and LOWER(w.from_address) = LOWER(b.minter)
      and w.to_address ILIKE _user_address and b.game_id = _game_id and b.type != 'level') as temp;
end; 
$$

create or replace function getTransferNftBoosts(
    _game_id bigint,
    _num_badges bigint,
    _user_address text
) 
returns table ( j json ) 
language plpgsql
as $$
declare 

begin
 RETURN QUERY select to_json(temp) from (SELECT b.id
      FROM boost_configuration AS b
      LEFT JOIN claimed_boost AS c ON b.id = c.boost_id AND c.user_address ILIKE _user_address
      WHERE b.boost_type = 'TRANSFER_NFT' 
      and b.game_id = _game_id
      AND c.boost_id IS NULL
      AND b.nft_amount <= _num_badges) as temp;
end; 
$$

*/
