import { NextRequest, NextResponse } from 'next/server';

import { Inngest } from 'inngest';
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
    const gameId = parseInt(gameIdString);
    await inngest.send({
      name: InngestEvents.UserPointDistribute,
      data: {
        gameId: gameId,
        //we leave out from,to,claimId here so we get automated generation of values
      },
    });
  } catch (error) {
    console.error('error running cron:', error);
  }
  return NextResponse.json({ success: true });
}
