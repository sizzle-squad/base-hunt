import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { createClient } from '@supabase/supabase-js';

import { toBigInt } from '@/utils/toBigInt';

import { ChallengeStatus } from '@/utils/database.enums';
import {
  ProfileBadge,
  ProfileState,
  ReferralData,
} from '../../../../hooks/types';

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

type BadgeDataType = {
  id: number;
  name: string;
  game_id: bigint;
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
    const referrals = await supabase.rpc('get_referral_data', {
      _game_id: gameId,
      _user_address: userAddress.toLowerCase(),
    });

    if (referrals.error) {
      console.error(referrals.error);
      throw new Error(referrals.error.message);
    }

    const isOptedIn = referrals.data && referrals.data.length > 0;

    if (!isOptedIn) {
      const notOptedInResponse: ProfileState = {
        isOptedIn: false,
        numChallengesCompleted: BigInt(0),
        referralData: { referralCode: '', numReferrals: BigInt(0) },
        levelData: {
          currentLevel: null,
          nextLevel: null,
        },
        scoreData: null,
        badges: [],
      };
      return NextResponse.json(notOptedInResponse);
    }

    const [scoreData, levelsData, challengeData, userBadgesResponse] =
      await Promise.all([
        // fetch score data
        supabase
          .from('score')
          .select()
          .eq('user_address', userAddress.toLowerCase())
          .eq('game_id', gameId),
        // fetch level data
        supabase.from('level_configuration').select().eq('game_id', gameId),
        // fetch challenge data
        supabase
          .from('user_challenge_status')
          .select('*', { count: 'exact', head: true })
          .eq('user_address', userAddress.toLowerCase())
          .eq('status', ChallengeStatus.COMPLETE),
        // fetch user badges
        supabase.rpc('getuserbadges-v2', {
          _game_id: gameId,
          _user_address: userAddress.toLowerCase(),
        }),
      ]);

    if (scoreData.error) {
      console.error(scoreData.error);
      throw new Error(scoreData.error.message);
    }
    if (levelsData.error) {
      console.error(levelsData.error);
      throw new Error(levelsData.error.message);
    }
    if (challengeData.error) {
      console.error(challengeData.error);
      throw new Error(challengeData.error.message);
    }
    if (userBadgesResponse.error) {
      console.error(userBadgesResponse.error);
      throw new Error(userBadgesResponse.error.message);
    }

    // Extract data
    const score = scoreData.data[0];
    const currentScore = score ? score.current_score : BigInt(0);
    const [currentLevel, nextLevel] = getLevelData(
      levelsData,
      score,
      currentScore
    );
    const numChallengesCompleted = BigInt(challengeData.count || 0);
    const referralData: ReferralData = {
      referralCode: referrals.data[0]?.referral_id ?? '',
      numReferrals: referrals.data[0]?.count
        ? BigInt(referrals.data[0]?.count)
        : BigInt(0),
    };

    const response = NextResponse.json(
      mapToProfileState(
        currentLevel,
        nextLevel,
        score,
        gameId,
        numChallengesCompleted,
        mapToBadges(userBadgesResponse.data as BadgeDataType[]),
        referralData,
        isOptedIn
      )
    );

    return response;
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
    return [currentLevel, nextLevel];
  }
  const maxLevel: LevelDataType = {
    id: 0,
    created_at: '',
    game_id: BigInt(2),
    name: 'max level',
    threshold_points: Number.MAX_SAFE_INTEGER,
    airdrop_command: '',
    level: 'max level',
    contract_address: '',
    minter: '',
    image_url: null,
    badge_type: '',
    token_id: 0,
    description: '',
    cta_url: null,
    prize_image_url: null,
    prize_description: null,
  };

  levels.push(maxLevel);
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
      level: '0',
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
  return [currentLevel, nextLevel];
}

function mapToProfileState(
  c: any,
  n: any,
  s: any,
  gameId: bigint,
  numChallengesCompleted: bigint,
  formattedUserBadges: ProfileBadge[],
  referrals: ReferralData,
  isOptedIn: boolean
): ProfileState {
  return {
    isOptedIn: isOptedIn,
    numChallengesCompleted: numChallengesCompleted,
    referralData: referrals,
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
    badges: formattedUserBadges,
  };
}

function mapToBadges(badgesData: BadgeDataType[]): ProfileBadge[] {
  if (!badgesData) {
    return [];
  }
  return badgesData.map((badge: BadgeDataType) => ({
    id: badge.id.toString(),
    name: badge.name,
    gameId: badge.game_id.toString(),
  }));
}
