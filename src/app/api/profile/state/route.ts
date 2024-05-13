import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { createClient } from '@supabase/supabase-js';

import { toBigInt } from '@/utils/toBigInt';

import { ProfileState } from '../../../../hooks/types';
import { ChallengeStatus } from '@/utils/database.enums';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

type LevelDataType = {
  id: number;
  created_at: string;
  game_id: bigint;
  name: string;
  threshold_points: number;
  airdrop_command: string;
  level: string;
  contract_address: string;
  minter: string;
  image_url: string | null;
  badge_type: string;
  token_id: number;
  description: string;
  cta_url: string | null;
  prize_image_url: string | null;
  prize_description: string | null;
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
    const [currentLevel, nextLevel] = getLevelData(levelsData, score, currentScore)

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

    return NextResponse.json(mapToProfileState(currentLevel, nextLevel, score, gameId, BigInt(numChallengesCompleted || 0)));
  } catch (e) {
    console.error(e);
    NextResponse.error();
  }

}

function getLevelData(levelsData: any, score: any, currentScore: any) {
  let levels = levelsData.data as LevelDataType[];
  let nextLevel = null;
  let currentLevel = null;

  if (!levels || levels.length === 0) {
    return [currentLevel, nextLevel]
  }
  const emptyLevel: LevelDataType = {
    id: 0,
    created_at: '',
    game_id: BigInt(0),
    name: '',
    threshold_points: 0,
    airdrop_command: '',
    level: '',
    contract_address: '',
    minter: '',
    image_url: null,
    badge_type: '',
    token_id: 0,
    description: '',
    cta_url: null,
    prize_image_url: null,
    prize_description: null
  };

  levels.push(emptyLevel);
  //inplace sort by threshold points
  levels.sort((a: LevelDataType, b: LevelDataType) => {
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

function mapToProfileState(c: any, n: any, s: any, gameId: bigint, numChallengesCompleted: bigint): ProfileState {
  return {
    numChallengesCompleted: numChallengesCompleted,
    referralData: { // todo: get referral data
      numReferrals: BigInt(0),
      referralCode: ""
    },
    levelData: {
      currentLevel: c
        ? {
          id: c.id,
          gameId: c.game_id,
          name: c.name,
          thresholdPoints: c.threshold_points,
          level: c.level,
          description: c.description,
          ctaUrl: c.cta_url,
          prizeImageUrl: c.prize_image_url,
          prizeDescription: c.prize_description,
          imageUrl: c.image_url,
        }
        : {
          id: '',
          gameId: gameId.toString(),
          name: 'zero level',
          thresholdPoints: BigInt(0),
          level: '1',
          description: '',
          ctaUrl: '',
          prizeImageUrl: '',
          prizeDescription: '',
          imageUrl: '',
        },
      nextLevel: {
        id: n.id,
        gameId: n.game_id,
        name: n.name,
        thresholdPoints: n.threshold_points,
        level: n.level,
        description: n.description,
        ctaUrl: n.cta_url,
        prizeImageUrl: n.prize_image_url,
        prizeDescription: n.prize_description,
        imageUrl: n.image_url,
      },
    },
    scoreData: s
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
