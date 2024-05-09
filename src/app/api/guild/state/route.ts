import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { Database } from '@/utils/database.types';
import {
  get5pmMstDateRangeFromCurrent,
  getGuildTxCounts,
  GuildScoreData,
} from '@/utils/guild/helpers';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

type GuildData = {
  created_at: string;
  game_id: number;
  guild_id: string;
  id: number;
  image_url: string | null;
  leader: string;
  name: string;
  total_member_count: number | null;
  social_link: string | null;
  is_enabled: boolean;
};

// Fetch all guilds
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (gameId === null) {
    return new Response(`No gameId found`, {
      status: 405,
    });
  }
  // Get current date range
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
    return new Response(`Error getting guilds: ${error}`, {
      status: 400,
    });
  }

  let ranks =
    result
      ?.map((r, idx) => {
        return {
          guild_id: r[0],
          rank: idx + 1,
          currentScore: r[1],
        };
      })
      .reduce(
        (acc, curr) => {
          acc[curr.guild_id] = curr;
          return acc;
        },
        {} as Record<
          string,
          { guild_id: string; rank: number; currentScore: number }
        >
      ) || {};
  //get guild membership count
  //NOTE: supabase does not currently offer a group by aggregate capability
  const memberCountData = await supabase.rpc('guildmembercount', {
    _game_id: Number(gameId),
  });
  if (memberCountData.error) {
    return new Response(`Error getting guild member counts: ${error}`, {
      status: 400,
    });
  }
  //get guild win shares
  const winSharesData = await supabase.rpc('guildwinshares', {
    _game_id: Number(gameId),
  });
  if (winSharesData.error) {
    return new Response(`Error getting guild win shares: ${error}`, {
      status: 400,
    });
  }
  let winShares = winSharesData.data.reduce(
    (acc, curr) => {
      acc[curr.guild] = curr.count;
      return acc;
    },
    {} as Record<string, number>
  );

  let memberCounts = memberCountData.data.reduce(
    (acc, curr) => {
      acc[curr.guild] = curr.count;
      return acc;
    },
    {} as Record<string, number>
  );

  const referralCount = await getGuildReferralCount(
    gameId,
    guildsData.data.map((g) => g.guild_id)
  );

  const leaderboardResult = guildsData.data.map((guild) => ({
    id: guild.guild_id,
    name: guild.name,
    gameId: guild.game_id,
    totalMemberCount: memberCounts[guild.guild_id] || 0,
    leader: guild.leader,
    currentScore: ranks[guild.guild_id].currentScore, // TODO: add currentScore column in guild_configuration
    rank: ranks[guild.guild_id].rank || 0, // TODO: add getGuildRank function in supabase
    imageUrl: guild.image_url,
    winShares: winShares[guild.guild_id] || 0,
    socialLink: guild.social_link || '',
    isEnabled: guild.is_enabled,
    totalReferralCount: referralCount[guild.guild_id],
  }));

  const response = NextResponse.json(
    leaderboardResult.sort((a, b) => a.rank - b.rank)
  );

  // cache for 5 minutes (5*60)
  response.headers.set('Cache-Control', 'public, s-maxage=300');
  response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');
  response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=300');

  return response;
}

export async function getGuildReferralCount(
  gameId: bigint,
  guildIds: string[]
): Promise<Record<string, number>> {
  //get total member count

  const guildScoreData = await Promise.all(
    guildIds.map(async (guildId) => {
      return supabase
        .from('guild_user_referral')
        .select('*', { count: 'exact', head: true })
        .eq('game_id', gameId)
        .eq('guild_id', guildId);
    })
  );

  const result = guildScoreData
    .map((gsd, idx) => {
      return {
        guildId: guildIds[idx],
        count: gsd.error ? 0 : gsd.count ?? 0,
      };
    })
    .reduce(
      (acc, curr) => {
        acc[curr.guildId] = curr.count;
        return acc;
      },
      {} as Record<string, number>
    );
  return result;
}

export async function getGuildRanks(
  gameId: bigint,
  from: Date,
  to: Date,
  guildsData: GuildData[]
): Promise<{
  result?: [string, number][];
  error?: Error;
}> {
  // Get current date range
  const { data, error } = await supabase
    .from('guild_score')
    .select('id, guild_id,score')
    .gte('timestamp', from.toISOString())
    .lte('timestamp', to.toISOString())
    .returns<GuildScoreData[]>();

  if (error) {
    console.error(error);
    return { error: new Error(`No guilds found with gameId: ${gameId}`) };
  }

  const result = await getGuildTxCounts(data);

  for (let i = 0; i < guildsData.length; i++) {
    if (!result.hasOwnProperty(guildsData[i].guild_id)) {
      result[guildsData[i].guild_id] = 0;
    }
  }
  const sorted = Object.entries(result).sort((a, b) => b[1] - a[1]);
  return { result: sorted };
}
