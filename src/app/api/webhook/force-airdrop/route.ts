import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

import { airdropNft } from '@/utils/walletapi';
import { verifyWebhookSecret } from '@/utils/webhook';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

const commandLog = '[webhook force airdrop]';

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

// this endpoints allows us to force airdrop a level NFT
export async function POST(req: Request) {
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ status: 'unknown' });
  }

  console.log(commandLog);
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
    for (let i = 0; i < levelData.data.length; i++) {
      const level = levelData.data[i];
      const nonce = ethers.hexlify(ethers.randomBytes(32));

      try {
        await airdropNft(
          body.record.user_address,
          level.airdrop_command,
          nonce
        );
      } catch (error) {
        console.log(error);
        return NextResponse.json({
          status: 'error',
          message: `failed to airdrop ${level} NFT`,
        });
      }
    }
  } else {
    console.log(
      `${commandLog} no level found`,
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

  return NextResponse.json({ status: 'ok' });
}
