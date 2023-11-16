import { PrismaClient } from '@prisma/client';
import { type NextRequest } from 'next/server';
import '@/utils/helper';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Level, ScoreState } from '../../../../hooks/types';
const prisma = new PrismaClient();

/*
curl -X POST 'http://localhost:3000/api/level/claim' -d ' {"type":"INSERT","table":"webhook_data","record":{"value":"0x0000000000000000000000000000000000000000000000000000000000000002","log_index":"0x0","block_hash":"0x7b247ffeae4605413ae1729d51f0c5c8ad4df8f92e18cdfeedbf2a44bb391f8f","created_at":"2023-11-08T09:01:57.114+00:00","event_type":"EVENT_TYPE_TRANSFER_ERC1155","network_id":"networks/base-goerli-testnet","to_address":"0xa14a25930babc1220df002070be86b030b1d4c68","from_address":"0x4c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d5","block_timestamp":"seconds:1699434114","contract_address":"0x68814e0f414b8fbcf984d3af85edfa365ef7254c","transaction_hash":"0x67b0c7879ea1821a5ff8e68ce43b48be98fab6f27addc9db3c51cce534513629","is_to_address_cbw":true,"is_from_address_cbw":true},"schema":"public","old_record":null}'  -H 'Content-Type: application/json'
*/

export async function GET(req: NextRequest) {
  const headersList = headers();
  const referer = headersList.get('x-app-secert');
  const searchParams = req.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress') as string;
  const gameId = BigInt(searchParams.get('gameId') as string);

  const score = await prisma.score.findFirst({
    where: {
      user_address: {
        equals: userAddress,
        mode: 'insensitive',
      },
      game_id: gameId,
    },
  });

  let levels = await prisma.level_configuration.findMany({
    where: {
      game_id: gameId,
    },
  });

  //inplace sort by threshold points
  levels.sort((a: any, b: any) => {
    if (a.threshold_points > b.threshold_points) {
      return 1;
    } else if (a.threshold_points < b.threshold_points) {
      return -1;
    } else {
      return 0;
    }
  });

  let nextLevel = null;
  let currentLevel = null;

  if (score) {
    const nextLevelIdx = levels.findIndex(
      (level: any) => level.threshold_points > score.current_score
    );

    if (nextLevelIdx != null) {
      nextLevel = levels[nextLevelIdx];
      if (nextLevelIdx > 0) {
        currentLevel = levels[nextLevelIdx - 1];
      }
    }
  } else {
    nextLevel = levels[0];
  }

  const scoreState = mapToScore(currentLevel, nextLevel, score, gameId);

  return NextResponse.json(scoreState);
}

function mapToScore(c: any, n: any, s: any, gameId: bigint): ScoreState {
  return {
    currentLevel: c
      ? {
          id: c.id,
          gameId: c.game_id,
          name: c.name,
          thresholdPoints: c.threshold_points,
          level: c.level,
        }
      : {
          id: '',
          gameId: gameId.toString(),
          name: 'zero level',
          thresholdPoints: BigInt(0),
          level: '0',
        },
    nextLevel: n
      ? {
          id: n.id,
          gameId: n.game_id,
          name: n.name,
          thresholdPoints: n.threshold_points,
          level: n.level,
        }
      : {
          id: '',
          gameId: gameId.toString(),
          name: 'max level',
          thresholdPoints: BigInt(0),
          level: '999999',
        },
    score: s
      ? {
          id: s.id,
          gameId: s.game_id,
          userAddress: s.user_address,
          currentScore: s.current_score,
          updatedAt: s.updated_at,
        }
      : null,
  };
}
