import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { BadgeTypeEnum, Level, LevelState } from '../../../../hooks/types';
import { createClient } from '@supabase/supabase-js';
import { toBigInt } from '@/utils/toBigInt';
import {
  GuildScoreData,
  get5pmMstDateRangeFromCurrent,
} from '@/utils/guild/helpers';
import axios from 'axios';
import { getGuildRanks } from '../../guild/state/route';

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
    return NextResponse.json({
      id: null,
      name: null,
      guildId: null,
    });
  }

  //Get guild data
  let guild: {
    guild_id: string;
    id: bigint;
    name: string;
    leader: string;
    image_url: string | null;
  };

  //TODO: these 3 calls can be parallelized
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

  //Get guild win shares
  let guildWin = null;
  const guildWinData = await supabase
    .from('guild_win')
    .select('*')
    .eq('game_id', gameId)
    .eq('guild_id', guild.guild_id);

  if (guildWinData.error) {
    console.error(guildWinData.error);
    return new Response(
      `Error getting guild wins: guild_id: ${guild.guild_id}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  guildWin = guildWinData.data;
  const [from, to] = await get5pmMstDateRangeFromCurrent(new Date());
  const { result, error } = await getGuildRanks(gameId, from, to);

  if (error) {
    return new Response(error.message, {
      status: 400,
    });
  }

  //get guild daily rank
  const rank = result?.findIndex((g) => g[0] === guild.guild_id) || -1;
  if (rank === -1) {
    return new Response('unable to get guild rank', {
      status: 400,
    });
  }

  const score = result ? result[rank as number][1] : 0;
  return NextResponse.json({
    id: guild.id,
    name: guild.name,
    guildId: guild.guild_id,
    leader: guild.leader,
    imageUrl: guild.image_url || null,
    totalWinShares: guildWin.length,
    currentDailyScore: score,
    currentDailyRank: rank,
  } as GuildData);
}

export type GuildData = {
  id: bigint | null;
  name: string | null;
  guildId: string | null;
  leader: string;
  imageUrl: string | null;
  currentDailyScore: number;
  totalWinShares: number;
  currentDailyRank: number;
};
