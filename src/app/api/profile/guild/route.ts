import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { createClient } from '@supabase/supabase-js';

import { get5pmMstDateRangeFromCurrent } from '@/utils/guild/helpers';
import { toBigInt } from '@/utils/toBigInt';

import { getClaimablev2 } from '../../guild/claim/route';
import { getGuildRanks } from '../../guild/state/route';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userAddress = (searchParams.get('userAddress') as string).toLowerCase();
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

  //get total member count
  const totalMemberCountData = await supabase
    .from('guild_member_configuration')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId)
    .eq('guild_id', userGuildData.data.guild_id);

  if (totalMemberCountData.error) {
    console.error(totalMemberCountData.error);
    return new Response(
      `Error getting total member count: guild_id: ${userGuildData.data.guild_id}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  let totalMemberCount = totalMemberCountData.count ?? 0;

  //get total member count
  const totalReferralCountData = await supabase
    .from('guild_user_referral')
    .select('*', { count: 'exact', head: true })
    .eq('game_id', gameId)
    .eq('guild_id', userGuildData.data.guild_id);

  if (totalReferralCountData.error) {
    console.error(totalReferralCountData.error);
    return new Response(
      `Error getting total member count: guild_id: ${userGuildData.data.guild_id}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  let totalReferralCount = totalReferralCountData.count ?? 0;

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
  const guildsData = await supabase
    .from('guild_configuration')
    .select('*')
    .eq('game_id', gameId);

  if (guildsData.error) {
    return new Response(`Unable to retrieve guilds: ${gameId}`, {
      status: 400,
    });
  }
  const { result, error } = await getGuildRanks(
    gameId,
    from,
    to,
    guildsData.data
  );

  if (error) {
    return new Response(error.message, {
      status: 400,
    });
  }

  //get guild daily rank
  const rank = result?.findIndex((g) => g[0] === guild.guild_id) ?? -1;
  if (rank === -1) {
    console.warn('guild not found in ranks');
  }

  const score = result && rank >= 0 ? result[rank as number][1] : 0;

  //get guild points claimable / claimed by user

  const claimData = await getClaimablev2(gameId, userAddress);
  if (claimData.error) {
    console.error(claimData.error);
  }

  return NextResponse.json({
    id: guild.id,
    name: guild.name,
    guildId: guild.guild_id,
    leader: guild.leader,
    imageUrl: guild.image_url || null,
    totalWinShares: guildWin.length,
    currentDailyScore: score,
    currentDailyRank: rank > -1 ? rank + 1 : 0,
    claimablePoints:
      claimData?.result?.claimable.reduce(
        (acc, curr) => acc + curr.points,
        0
      ) ?? 0,
    claimedPoints:
      claimData?.result?.claimed.reduce((acc, curr) => acc + curr.points, 0) ??
      0,
    totalMemberCount: totalMemberCount,
    totalReferralCount: totalReferralCount,
  } as GuildData);
}

export type GuildData = {
  id: bigint | null;
  name: string;
  guildId: string | null;
  leader: string;
  imageUrl: string | null;
  currentDailyScore: number;
  totalWinShares: number;
  currentDailyRank: number;
  claimablePoints: number;
  claimedPoints: number;
  totalMemberCount: number;
  totalReferralCount: number;
};
