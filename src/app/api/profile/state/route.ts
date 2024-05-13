import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { createClient } from '@supabase/supabase-js';

import { toBigInt } from '@/utils/toBigInt';

import { BadgeTypeEnum, ProfileState } from '../../../../hooks/types';
import { ChallengeStatus } from '@/utils/database.enums';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

type QueryData = {
  id: bigint;
  name: string;
  image_url: string;
  to_address: string;
  type: BadgeTypeEnum;
  transaction_hash: string;
  created_at: Date;
  contract_address: string;
  token_id: bigint;
  cta_text: string;
  cta_url: string;
  lat_lng: string;
  description: string;
  artist_name: string;
};
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress') as string;
  const gameId = toBigInt(searchParams.get('gameId') as string);
  if (!userAddress || gameId === null) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  try {
    // fetch score data
    let scoreData = (await supabase
      .from('score')
      .select()
      .eq('user_address', userAddress.toLowerCase())
      .eq('game_id', gameId)) as any;

    if (scoreData.error) {
      console.error(scoreData.error);
      throw new Error(scoreData.error.message);
    }
    const score = scoreData.data[0];
    let currentScore = score ? score.current_score : BigInt(0);

    // fetch level data
    const levelsData = (await supabase
      .from('level_configuration')
      .select()
      .eq('game_id', gameId)) as any;

    const levelsError = levelsData.error;
    if (levelsError) {
      console.error(levelsError);
      throw new Error(levelsError.message);
    }
    const [currentLevel] = getLevelData(levelsData, score, currentScore)

    // fetch challenge data
    const { error, count: numChallengesCompleted } = await supabase
      .from('user_challenge_status')
      .select('*', { count: 'exact', head: true })
      .eq('user_address', userAddress.toLowerCase())
      .eq('status', ChallengeStatus.COMPLETE);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return NextResponse.json(mapToProfileState(currentLevel, score, BigInt(numChallengesCompleted || 0)));
  } catch (e) {
    console.error(e);
    NextResponse.error();
  }

}

function getLevelData(levelsData: any, score: any, currentScore: any) {
  let levels = levelsData.data as any[];
  let nextLevel = null;
  let currentLevel = null;

  if (!levels || levels.length === 0) {
    return [currentLevel, nextLevel]
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

  if (score) {
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].threshold_points > currentScore) {
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
      name: 'level-0',
      thresholdPoints: 0,
      level: '1',
    };
    nextLevel = levels[0];
  }

  if (nextLevel === null) {
    nextLevel = {
      id: '',
      name: 'max level',
      thresholdPoints: 0,
      level: 'max level',
    };
    currentLevel = levels[levels.length - 1];
  }
  return [currentLevel, nextLevel]
}

function mapToProfileState(currentLevel: any, scoreData: any, numChallengesCompleted: bigint): ProfileState {
  return {
    numChallengesCompleted: numChallengesCompleted,
    referralData: { // todo: get referral data
      numReferrals: BigInt(0),
      referralCode: ""
    },
    currentLevelName: currentLevel ? currentLevel.name : "zero level",
    points: scoreData ? scoreData.current_score : BigInt(0)
  };
}
