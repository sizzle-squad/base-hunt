import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

/*
curl -X POST 'http://localhost:3000/api/webhook/boost' -d ' {"type":"INSERT","table":"claimed_boost","record":{"user_address":"0xa14a25930babc1220df002070be86b030b1d4c68","game_id":0,"boost_id":3,"created_at":"2023-11-08T09:01:57.114+00:00"},"schema":"public","old_record":null}'  -H 'Content-Type: application/json'
*/
export async function POST(req: Request) {
  const body = await req.json();
  console.log('[webhook boost] body:', body);
  const boostData = (await supabase
    .from('boost_configuration')
    .select()
    .eq('id', body.record.boost_id)
    .eq('game_id', body.record.game_id)
    .single()) as any;
  if (boostData.error) {
    console.error(boostData.error);
    throw new Error(boostData.error.message);
  }
  const boost = boostData.data;
  console.log(boost);
  if (boost) {
    const { error } = await supabase
      .rpc('upsertscore', {
        _game_id: boost.game_id,
        _user_address: body.record.user_address,
        _increment: boost.points,
      })
      .select();
    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
  } else {
    console.log(
      '[webhook boost] no boost found:',
      body.record.boost_id,
      'gameId:',
      body.record.game_id
    );
  }
  return NextResponse.json({});
}

/*
database functions:

create or replace function upsertScore(
    _game_id bigint,
    _user_address text,
    _increment bigint
) 
returns table ( j json ) 
language plpgsql
as $$
declare 

begin
 INSERT INTO score (user_address,game_id, current_score) VALUES (_user_address, _game_id,_increment)
ON CONFLICT (user_address,game_id) DO
UPDATE SET current_score=score.current_score + _increment;
end; 
$$

*/
