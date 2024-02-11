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

export async function POST(req: NextRequest) {
  // const userAddress = req.nextUrl.searchParams.get('userAddress');
  // const gameId = req.nextUrl.searchParams.get('gameId');
  // const guildId = req.nextUrl.searchParams.get('guildId');
  console.log('searchParams:', req.nextUrl.searchParams);
  const body = await req.json();
  console.log('body:', body);
  const fm = await getFrameMessage(body, {
    neynarApiKey: 'NEYNAR_API_DOCS',
    castReactionContext: true,
    followContext: true,
  });

  console.log('fm:', JSON.stringify(fm));
  return new NextResponse(`
  <!DOCTYPE html><html><head>
  <meta property="fc:frame" content="vNext" />
  <meta name="fc:frame:image" content="https://i.ibb.co/tzy655S/guild-base-glitch.png"/>
  <meta name="fc:frame:button:1" content="Happy Hunting" />
  <meta name="fc:frame:button:1:action" content="post_redirect" />
  <meta name="fc:frame:post_url" content="https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fbase-hunt-eth-denver-2024.vercel.app%2F" />
  </head></html>`);
}
