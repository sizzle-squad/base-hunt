import { NextRequest, NextResponse } from 'next/server';

import { inngest } from '@/utils/inngest/client';

type namedEvent = 'events/user-tx-count' | 'events/user-point-distribute';

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
      name: 'events/user-tx-count',
      data: {
        gameId: gameId,
      },
    });
  } catch (error) {
    console.error('error running cron:', error);
  }
  return NextResponse.json({ success: true });
}
