import { NextRequest, NextResponse } from 'next/server';
import type { Metadata, ResolvingMetadata } from 'next';
import '@/utils/helper';
import { createClient } from '@supabase/supabase-js';
import { getFrameMessage, getFrameMetadata } from '@coinbase/onchainkit';
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { toBigInt } from '@/utils/toBigInt';
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

//const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string);

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
  let guild = guildData.data;

  return new NextResponse(`<!DOCTYPE html><html><head>
  <meta name="fc:frame" content="vNext" />
  <meta name="fc:frame:image" content="https://i.ibb.co/tzy655S/guild-base-glitch.png"/>
  <meta name="fc:frame:button:1" content="Join ${guild.name}" />
  <meta name="fc:frame:button:1:action" content="post" />
  <meta name="fc:frame:button:1:action:target" content="/api/frames/join?userAddress=${userAddress}&gameId=${gameId}&guildId=${guild.guild_id}" />
 /head></html>`);
}

export async function POST(req: NextRequest) {
  const userAddress = req.nextUrl.searchParams.get('userAddress');
  const gameId = req.nextUrl.searchParams.get('gameId');
  const guildId = req.nextUrl.searchParams.get('guildId');

  const body = await req.json();

  const fm = await getFrameMessage(body, {
    neynarApiKey: 'NEYNAR_API_DOCS',
    castReactionContext: true,
    followContext: true,
  });

  console.log(fm);
  return new NextResponse(`<!DOCTYPE html><html><head>
  <meta name="fc:frame" content="vNext" />
  <meta name="fc:frame:image" content="https://i.ibb.co/tzy655S/guild-base-glitch.png"/>
  <meta name="fc:frame:button:1" content="Happy Hunting" />
  <meta name="fc:frame:button:1:action" content="link" />
  <meta name="fc:frame:button:1:action:target" content="https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fbase-hunt-eth-denver-2024.vercel.app%2F" />
 /head></html>`);
}
