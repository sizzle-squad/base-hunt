import { TreasureBoxState } from '@/hooks/types';
import { verifyTreasureBoxRequest } from '@/utils/verifyTreasureBoxRequest';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { createClient } from '@supabase/supabase-js';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export type UserPublicProfileType = {
  address: `0x${string}`;
  cbId?: string;
  ensName?: string;
};

export type TreasureBoxType = {
  gameId: string;
  user: UserPublicProfileType;
};

export type TreasureBoxStateType = {
  id: bigint;
  created_at: Date;
  total_hitpoints: bigint;
  game_id: bigint;
  name: string;
  location: string;
  current_hitpoints: bigint | null;
  is_open: boolean | null;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);
  if (gameId === null) {
    return new Response('Missing parameters: gameId', { status: 400 });
  }
  const treasureBoxData = await supabase
    .from('treasure_box_configuration')
    .select()
    .eq('game_id', BigInt(gameId));
  if (treasureBoxData.error) {
    console.error(treasureBoxData.error);
    throw new Error(treasureBoxData.error.message);
  }
  const treasureBox = treasureBoxData.data[0];

  const treasureBoxStateData = await supabase
    .from('treasure_box_state')
    .select()
    .eq('game_id', BigInt(gameId));
  if (treasureBoxStateData.error) {
    console.error(treasureBoxStateData.error);
    throw new Error(treasureBoxStateData.error.message);
  }
  const treasureBoxState = treasureBoxStateData.data[0];

  if (!treasureBox || treasureBox.length === 0) {
    return new Response(`Treasure box not found with gameId: ${gameId}`, {
      status: 400,
    });
  }
  const tb = await mapTreasureBoxState({ ...treasureBoxState, ...treasureBox });
  console.log(tb);
  return NextResponse.json(tb);
}

async function mapTreasureBoxState(
  treasureBox: TreasureBoxStateType
): Promise<TreasureBoxState> {
  return {
    id: treasureBox.id as bigint,
    createdAt: treasureBox.created_at,
    gameId: treasureBox.game_id,
    name: treasureBox.name,
    location: treasureBox.location,
    totalHitpoints: treasureBox.total_hitpoints,
    currentHitpoints: treasureBox.current_hitpoints as bigint,
    isOpen: treasureBox.is_open === true,
  };
}

export async function POST(request: NextRequest) {
  const body: TreasureBoxType = await request.json();

  verifyTreasureBoxRequest(body);

  const { gameId, user } = body;

  const gameIdInBigInt = BigInt(gameId as string);

  let scoreData = (await supabase
    .from('score')
    .select()
    .ilike('user_address', user.address)
    .eq('game_id', gameId)) as any;

  if (scoreData.error) {
    console.error(scoreData.error);
    throw new Error(scoreData.error.message);
  }
  const score = scoreData.data[0];

  if (!score) {
    return new Response('Error: score not found', { status: 400 });
  }

  let tbeData = (await supabase
    .from('treasure_box_entries')
    .select()
    .ilike('user_address', user.address)
    .eq('game_id', gameId)) as any;
  if (tbeData.error) {
    return new Response('Error: treasure box entry not found', { status: 400 });
  }

  if (tbeData.data.length > 0) {
    const now = new Date();
    const nowHash = `${now.getFullYear()}:${now.getMonth()}:${now.getDate()}:${now.getHours()}`;
    const updatedAt = new Date(tbeData.data[0].updated_at);

    const updatedAtHash = `${updatedAt.getFullYear()}:${updatedAt.getMonth()}:${updatedAt.getDate()}:${updatedAt.getHours()}`;
    if (nowHash === updatedAtHash) {
      return new Response(
        `Error: tap count exceeded for now:${nowHash} updatedAt:${updatedAtHash}`,
        {
          status: 400,
        }
      );
    }
  }

  const params = {
    _game_id: gameIdInBigInt,
    _user_address: user.address.toLowerCase(),
    _cbid: user.cbId || '',
    _ens_name: user.ensName || '',
    _increment: score.current_score,
    _tap_count: BigInt(1),
  };
  console.log(params);
  const { error } = await supabase.rpc('upserttreasurebox', params);
  if (error) {
    console.error(error);
    return new Response('Error: failed to register treasure box entry', {
      status: 400,
    });
  }
  return NextResponse.json({ status: 'ok' });
}

/*
databse function:

create or replace function upsertTreasureBox(
    _game_id bigint,
    _user_address text,
    _cbid text,
    _ens_name text,    
    _increment bigint,
    _tap_count int4
) 
returns table ( j json ) 
language plpgsql
as $$
declare 
 _is_open_ boolean:=false;
begin
SELECT (treasure_box_state.current_hitpoints+_increment) > treasure_box_configuration.total_hitpoints INTO _is_open_
    FROM treasure_box_state, treasure_box_configuration
    WHERE treasure_box_state.game_id = treasure_box_configuration.game_id;
   _is_open_ = COALESCE(_is_open_, FALSE);
 INSERT INTO treasure_box_entries (game_id,user_address, cbid, ens_name,total_hitpoints,tap_count) VALUES (_game_id,_user_address,_cbid,_ens_name,_increment,_tap_count)
ON CONFLICT (user_address,game_id) DO
UPDATE SET total_hitpoints=treasure_box_entries.total_hitpoints + _increment,
tap_count = treasure_box_entries.tap_count + _tap_count;
INSERT INTO treasure_box_state (current_hitpoints,game_id,is_open) VALUES (_increment,_game_id,_is_open_)
ON CONFLICT (game_id) DO
UPDATE SET current_hitpoints=treasure_box_state.current_hitpoints + _increment,
is_open = _is_open_ ;
end; 
$$

*/
