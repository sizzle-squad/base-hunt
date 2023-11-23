import { AirdropNft } from '@/utils/walletapi';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

/*
curl -X POST 'http://localhost:3000/api/webhook/airdrop' -d '{
    "type": "UPDATE",
    "table": "score",
    "record": {
        "id": "3",
        "game_id": "0",
        "updated_at": "2023-11-09T02:22:09.379",
        "user_address": "0xa14a25930babc1220df002070be86b030b1d4c68",
        "current_score": "3"
    },
    "schema": "public",
    "old_record": {
        "id": "3",
        "game_id": "0",
        "updated_at": "2023-11-09T02:22:09.379",
        "user_address": "0xa14a25930babc1220df002070be86b030b1d4c68",
        "current_score": "2"
    }
}'  -H 'Content-Type: application/json'
*/

export async function POST(req: Request) {
  console.log('[webhook airdrop]');
  const body = await req.json();

  const currentScore = BigInt(body.record.current_score);
  let prevScore = BigInt(0);
  //if this is an update, then check prev score to new score
  if (body.old_record) {
    prevScore = BigInt(body.old_record.current_score);
  }
  const levelData = (await supabase
    .from('level_configuration')
    .select()
    .eq('game_id', BigInt(body.record.game_id))
    .lte('threshold_points', currentScore)
    .gt('threshold_points', prevScore)) as any;

  if (levelData.error) {
    console.error(levelData.error);
    throw new Error(levelData.error.message);
  }

  if (levelData.data && levelData.data.length > 0) {
    const level = levelData.data[0];
    await AirdropNft(body.record.user_address, level.airdrop_command);
  } else {
    console.log(
      '[webhook airdrop] no level found',
      'gameId:',
      body.record.game_id,
      'userAddress:',
      body.record.user_address,
      'currentScore:',
      currentScore,
      'prevScore:',
      prevScore
    );
  }

  return NextResponse.json({});
}
