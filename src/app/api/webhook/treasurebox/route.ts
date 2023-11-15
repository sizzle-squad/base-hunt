import { PrismaClient } from '@prisma/client';
import { AirdropNft } from '@/utils/walletapi';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

/*
curl -X POST 'http://localhost:3000/api/webhook/treasurebox' -d '
 {
  "type": "UPDATE",
  "table": "treasure_box_entries",
  "record": {
    "id": 6,
    "cbid": null,
    "game_id": 0,
    "ens_name": null,
    "tap_count": 3,
    "created_at": "2023-11-15T00:53:03.964+00:00",
    "user_address": "0xf80ff6cd749cde4335745f9270ff8d55b252dfd1",
    "total_hitpoints": 9
  },
  "schema": "public",
  "old_record": {
    "id": 6,
    "cbid": null,
    "game_id": 0,
    "ens_name": null,
    "tap_count": 2,
    "created_at": "2023-11-15T00:53:03.964+00:00",
    "user_address": "0xf80ff6cd749cde4335745f9270ff8d55b252dfd1",
    "total_hitpoints": 6
  }
}'  -H 'Content-Type: application/json'
*/
export async function POST(req: Request) {
  const body = await req.json();
  console.log('[webhook treasurebox]', body);
  if (
    (body.table as string) === 'treasure_box_entries' &&
    ((body.type as string) === 'INSERT' || (body.type as string) === 'UPDATE')
  ) {
    let totalAttack = body.record.total_hitpoints;
    if ((body.type as string) === 'UPDATE') {
      totalAttack = totalAttack - body.old_record.total_hitpoints;
    }
    console.log(
      '[webhook treasurebox] updating with totalAttack:',
      totalAttack,
      'userAddress',
      body.record.user_address,
      'gameId',
      body.record.game_id
    );
    const tb = await prisma.treasure_box_state.upsert({
      where: {
        game_id: body.record.game_id,
      },
      create: {
        game_id: body.record.game_id,
        current_hitpoints: totalAttack,
        is_open: false,
      },
      update: {
        current_hitpoints: {
          increment: totalAttack,
        },
      },
    });
    console.log(tb);
  } else {
    console.warn(
      '[webhook treasurebox] unsupported type:',
      body.type,
      body.table
    );
  }
  return NextResponse.json({});
}
