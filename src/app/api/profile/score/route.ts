import { type NextRequest } from 'next/server';
import '@/utils/helper';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Level, ScoreState } from '../../../../hooks/types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

/*
curl -X POST 'http://localhost:3000/api/level/claim' -d ' {"type":"INSERT","table":"webhook_data","record":{"value":"0x0000000000000000000000000000000000000000000000000000000000000002","log_index":"0x0","block_hash":"0x7b247ffeae4605413ae1729d51f0c5c8ad4df8f92e18cdfeedbf2a44bb391f8f","created_at":"2023-11-08T09:01:57.114+00:00","event_type":"EVENT_TYPE_TRANSFER_ERC1155","network_id":"networks/base-goerli-testnet","to_address":"0xa14a25930babc1220df002070be86b030b1d4c68","from_address":"0x4c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d5","block_timestamp":"seconds:1699434114","contract_address":"0x68814e0f414b8fbcf984d3af85edfa365ef7254c","transaction_hash":"0x67b0c7879ea1821a5ff8e68ce43b48be98fab6f27addc9db3c51cce534513629","is_to_address_cbw":true,"is_from_address_cbw":true},"schema":"public","old_record":null}'  -H 'Content-Type: application/json'
*/

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress') as string;
  const gameIdString = searchParams.get('gameId') as string;
  if (!userAddress || !gameIdString) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameIdString}`,
      {
        status: 400,
      }
    );
  }
  let gameId = BigInt(gameIdString);
  try {
    let scoreData = (await supabase
      .from('score')
      .select()
      .ilike('user_address', userAddress)
      .eq('game_id', gameId)) as any;

    if (scoreData.error) {
      console.error(scoreData.error);
      throw new Error(scoreData.error.message);
    }
    const score = scoreData.data[0];

    const levelsData = (await supabase
      .from('level_configuration')
      .select()
      .eq('game_id', gameId)) as any;

    console.log(levelsData);

    const levelsError = levelsData.error;
    let levels = levelsData.data as any[];
    if (levelsError) {
      console.error(levelsError);
      throw new Error(levelsError.message);
    }

    if (!levels || levels.length === 0) {
      return NextResponse.json({});
    }
    levels.push({});
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
    let currentScore = score ? score.current_score : BigInt(0);

    if (score) {
      for (let i = 0; i < levels.length; i++) {
        console.log(levels[i]);
        if (levels[i].threshold_points > currentScore) {
          console.log('setting current score');
          nextLevel = levels[i];
          if (i > 0) {
            currentLevel = levels[i - 1];
          }
          break;
        }
      }
    }
    if (currentLevel === null) {
      currentLevel = {
        id: '',
        gameId: gameId,
        name: 'level-0',
        thresholdPoints: 0,
        level: '0',
      };
      nextLevel = levels[0];
    }

    if (nextLevel === null) {
      nextLevel = {
        id: '',
        gameId: gameId,
        name: 'max level',
        thresholdPoints: 0,
        level: 'max level',
      };
      currentLevel = levels[levels.length - 1];
    }
    const scoreState = mapToScore(currentLevel, nextLevel, score, gameId);

    return NextResponse.json(scoreState);
  } catch (e) {
    console.error(e);
    NextResponse.error();
  }
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
          description: c.description,
        }
      : {
          id: '',
          gameId: gameId.toString(),
          name: 'zero level',
          thresholdPoints: BigInt(0),
          level: '1',
          description: '',
        },
    nextLevel: {
      id: n.id,
      gameId: n.game_id,
      name: n.name,
      thresholdPoints: n.threshold_points,
      level: n.level,
      description: n.description,
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
