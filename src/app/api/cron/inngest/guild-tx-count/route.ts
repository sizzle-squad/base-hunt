import { NextRequest, NextResponse } from 'next/server';

import { inngest } from '@/utils/inngest/client';
import { InngestEvents } from '@/utils/inngest/functions';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }
    const gameIdString = searchParams.get('gameId') as string;
    const guildId = searchParams.get('guildId') as string;
    const gameId = parseInt(gameIdString);
    await inngest.send({
      name: InngestEvents.GuildTxCount,
      data: {
        gameId: gameId,
        guildId: guildId,
      },
    });
  } catch (error) {
    console.error('error running cron:', error);
  }
  return NextResponse.json({ success: true });
}
