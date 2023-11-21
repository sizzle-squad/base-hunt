import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

/*
curl -X POST 'http://localhost:3000/api/webhook/boost' -d ' {"type":"INSERT","table":"claimed_boost","record":{"user_address":"0x4c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d5","game_id":0,"boost_id":3,"created_at":"2023-11-08T09:01:57.114+00:00"},"schema":"public","old_record":null}'  -H 'Content-Type: application/json'
*/
export async function POST(req: Request) {
  const body = await req.json();
  console.log('[webhook boost] body:', body);
  const boost = await prisma.boost_configuration.findFirst({
    where: {
      id: body.record.boost_id,
      game_id: body.record.game_id,
    },
  });
  console.log(boost);
  if (boost) {
    const scoreUpdate = await prisma.score.upsert({
      where: {
        user_address_game_id: {
          user_address: body.record.user_address,
          game_id: boost.game_id,
        },
      },
      create: {
        current_score: boost.points,
        user_address: body.record.user_address,
        game_id: boost.game_id,
      },
      update: {
        current_score: {
          increment: boost.points,
        },
      },
    });
    console.log(scoreUpdate);
  } else {
    console.log(
      '[webhook boost] no boost found:',
      body.record.boost_id,
      'gameId:',
      body.record.game_id
    );
  }
  return NextResponse.json({});
}
