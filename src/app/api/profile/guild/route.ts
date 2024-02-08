import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { BadgeTypeEnum, Level, LevelState } from '../../../../hooks/types';
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

  //get user guild
  const userGuildData = await supabase
    .from('guild_member_configuration')
    .select('*')
    .eq('game_id', gameId)
    .eq('user_address', userAddress)
    .maybeSingle();
  if (userGuildData.error) {
    console.error(userGuildData.error);
    return new Response(
      `Error getting guild membership: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  //user is not part of guild
  if (!userGuildData.data) {
    return NextResponse.json({});
  }

  //Get guild data
  let guild = null;
  if (!userGuildData.data) {
    const guildData = await supabase
      .from('guild_configuration')
      .select('*')
      .eq('game_id', gameId)
      .eq('guild_id', userGuildData.data.guild_id)
      .single();
    if (guildData.error) {
      console.error(guildData.error);
      return new Response(
        `Error getting guild: guild_id: ${userGuildData.data.guild_id}, gameId: ${gameId}`,
        {
          status: 400,
        }
      );
    }
    guild = guildData.data;
  }
}

export type GuildData = {
  id: bigint;
  name: string;
  guild_id: string;
  leader: string;
  imageUrl: string;
  currentDailyScore: bigint;
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
