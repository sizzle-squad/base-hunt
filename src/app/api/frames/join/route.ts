import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { createClient } from '@supabase/supabase-js';
import { getFrameMessage } from '@coinbase/onchainkit';
import axios from 'axios';
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

const DOMAIN = process.env.VERCEL_URL as string; //NOTE: does not include protocol

const NEYNAR_API_KEY =
  (process.env.NEYNAR_API_KEY as string) || 'NEYNAR_API_DOCS';

export async function POST(req: NextRequest) {
  const userAddress = req.nextUrl.searchParams.get('userAddress');
  const gameId = req.nextUrl.searchParams.get('gameId');
  const guildId = req.nextUrl.searchParams.get('guildId');

  if (!userAddress || !gameId === undefined || !guildId) {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  const body = await req.json();

  const fm = await getFrameMessage(body, {
    neynarApiKey: NEYNAR_API_KEY,
    castReactionContext: true,
    followContext: true,
  });

  console.log('fm:', JSON.stringify(fm));

  if (
    fm.isValid &&
    fm.message &&
    fm.message.raw.action.interactor.verifications.length > 0
  ) {
    const postUrl = new URL(fm.message.raw.action.url);
    if (postUrl.origin !== DOMAIN) {
      return new NextResponse(`Invalid Origin ${postUrl.origin}`, {
        status: 400,
      });
    }

    const verificationAddress =
      fm.message.raw.action.interactor.verifications[0].toLowercase();

    //Check if the clicking user is already in a guild
    const memberData = await supabase
      .from('guild_member_configuration')
      .select()
      .eq('game_id', gameId)
      .eq('user_address', verificationAddress)
      .maybeSingle();

    if (memberData.error) {
      console.error(memberData.error);
    }

    if (memberData.data !== null) {
      const guild = await getGuildData(gameId as string, guildId as string);
      return new NextResponse(`
      <!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${guild?.image_url}"/>
      <meta property="fc:frame:button:1" content="Happy Hunting ${fm.message.raw.action.interactor.display_name}" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fbase-hunt-eth-denver-2024.vercel.app%2F" />
      </head></html>`);
    }

    const resp = await axios.post(`https://${DOMAIN}/api/guild`, {
      userAddress: verificationAddress,
      gameId: gameId,
      guildId: guildId,
    });

    console.log('post:', resp.data);

    if (resp.status !== 200) {
      return new NextResponse('Error', { status: 400 });
    }
    const guild = await getGuildData(gameId as string, guildId as string);
    return new NextResponse(`
      <!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${guild?.image_url}"/>
      <meta property="fc:frame:button:1" content="Welcome ${fm.message.raw.action.interactor.display_name}" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fbase-hunt-eth-denver-2024.vercel.app%2F" />
      </head></html>`);
  } else {
    //no verification address found
    `<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://i.ibb.co/tzy655S/guild-base-glitch.png"/>
    <meta property="fc:frame:button:1" content="Verify CBWallet Address" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fbase-hunt-eth-denver-2024.vercel.app%2F" />
    </head></html>`;
  }
}

async function getGuildData(
  gameId: string,
  guildId: string
): Promise<{
  guild_id: any;
  game_id: any;
  image_url: any;
  name: any;
} | null> {
  const guildData = await supabase
    .from('guild_configuration')
    .select('guild_id, game_id, image_url, name')
    .eq('game_id', gameId)
    .eq('guild_id', guildId)
    .maybeSingle();
  if (guildData.error) {
    return null;
  }
  return guildData.data;
}
