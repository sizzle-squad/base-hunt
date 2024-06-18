import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import {
  CheckFunctions,
  MapChallengeTypeUserAddress,
  ValidateBodyParams,
} from '@/utils/claims/selectors';
import { ChallengeStatus } from '@/utils/database.enums';
import { providers } from '@/utils/ethereum';
import { toBigInt } from '@/utils/toBigInt';
import { WALLET_API_BASE_URL } from '@/utils/constants';
import { checkBalance, checkTokenIdBalance } from '@/utils/claims/balanceCheck';

const ALLOWED_ORGINS = process.env.ALLOWED_ORGINS?.split(',') ?? [];

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export type BoostsClaimRequest = {
  gameId: string;
  userAddress: string;
  challengeId: string;
};

interface Params {
  gte: number;
  tokenId: string;
}

export interface ChallengeWithStatus {
  id: number;
  created_at: string;
  display_name: string;
  auto_claim: boolean;
  params: Params;
  contract_address: string;
  points: number;
  game_id: number;
  type: string;
  network: string;
  difficulty_type: string;
  function_type: string;
  badge_id: number;
  challenge_id: string;
  user_challenge_status: Status[];
}

export interface Status {
  status: string;
  user_address: string;
}

type ocsChallengeCard = {
  contractAddress: string;
  tokenId: string;
  points: number;
  tokenAmount: string;
};

type ExploreContentResponse = {
  content: {
    ocsChallengeCard: ocsChallengeCard;
  };
};

async function getContentByIdUnauth(contentId: string) {
  const url = `${WALLET_API_BASE_URL}/rpc/v2/explore/getContentByIdUnauth?surface=1&id=${contentId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Coinbase API fetch failed:', response.status);
      return null;
    }

    const result: ExploreContentResponse = await response.json();
    return result.content;
  } catch (error) {
    console.error('Coinbase API fetch failed:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body: BoostsClaimRequest = await request.json();

  const { gameId, userAddress, challengeId } = body;

  if (!userAddress || gameId === undefined || !challengeId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, challengeId: ${challengeId}`,
      {
        status: 400,
      }
    );
  }

  const gameIdInBigInt = toBigInt(gameId as string);
  const challengeData = await supabase
    .from('challenge_configuration')
    .select<string, ChallengeWithStatus>(
      `
    *,
    user_challenge_status (
      user_address,
      status
    )`
    )
    .eq('challenge_id', challengeId)
    .eq('game_id', gameIdInBigInt)
    .eq('user_challenge_status.user_address', userAddress.toLowerCase())
    .single();

  if (challengeData.error) {
    console.error(challengeData.error);
    return new Response(
      `Unable to claim challenge for challengeId: ${challengeId}, gameId: ${gameId}.`,
      { status: 400 }
    );
  }

  const challenge = challengeData.data;
  const exploreChallengeId = challenge.challenge_id;
  if (!exploreChallengeId) {
    console.error('explore challenge id not found');
    return new Response(
      `Unable to claim challenge for challengeId: ${challengeId}, gameId: ${gameId}.`,
      { status: 400 }
    );
  }

  if (challenge.user_challenge_status.length > 0) {
    //challenge already claimed
    console.log(
      `challenge already claimed: ${challenge.user_challenge_status[0].status}`
    );
    // await createUserBadge(challenge.badge_id, userAddress, gameIdInBigInt);
    return NextResponse.json({ success: true, message: 'challenge-claimed' });
  }

  if (
    !ValidateBodyParams[challenge.function_type as keyof typeof CheckFunctions](
      body
    )
  ) {
    console.error(
      'invalid body params for challenge:' +
        challenge.id +
        ' function type:' +
        challenge.function_type
    );
    return NextResponse.json(
      {
        success: false,
        message: 'invalid-body-params',
      },
      { status: 405 }
    );
  }

  const exploreContent = await getContentByIdUnauth(exploreChallengeId);
  if (!exploreContent) {
    console.error(
      `explore content not found for exploreChaellengeId: ${exploreChallengeId}`
    );
    return new Response(
      `Experience not found for challengeId: ${challengeId}, gameId: ${gameId}.`,
      { status: 400 }
    );
  }

  const tokenId = exploreContent?.ocsChallengeCard?.tokenId;
  const contractAddress = exploreContent?.ocsChallengeCard?.contractAddress;
  const points = exploreContent?.ocsChallengeCard?.points;
  const tokenAmount = exploreContent?.ocsChallengeCard?.tokenAmount;

  // Provider is always base mainnet
  const provider = providers['networks/base-mainnet'];

  const checkFunc = getValidateFunction(
    exploreContent.ocsChallengeCard as ocsChallengeCard
  );

  if (checkFunc === undefined) {
    console.error(
      'check function is undefined:' +
        challenge.function_type +
        ' challenge id:' +
        challenge.id
    );

    return NextResponse.json(
      {
        success: false,
        message: 'invalid-check-function',
      },
      { status: 405 }
    );
  }

  if (provider === undefined) {
    console.error('provider is undefined for network:' + challenge.network);
    return NextResponse.json(
      {
        success: false,
        message: 'invalid-provider',
      },
      { status: 405 }
    );
  }

  const checkFuncData = {
    ...body,
    ...challenge,
    contractAddress,
    tokenAmount,
    tokenId,
  };

  let userCompletedChallenge = await checkFunc(checkFuncData, provider);
  if (userAddress.toLowerCase().startsWith('0x000000')) {
    // temporary loadtest bypass, loadtest user address starts with 0x000000
    // TODO: Remove before launch
    userCompletedChallenge = true;
  }

  if (userCompletedChallenge) {
    try {
      let userAddress =
        await MapChallengeTypeUserAddress[
          challenge.function_type as keyof typeof CheckFunctions
        ](checkFuncData);
      if (userAddress === undefined) {
        throw new Error(
          'user address could not be mapped and is undefined:' + checkFuncData
        );
      }

      const claim = await supabase
        .from('user_challenge_status')
        .upsert(
          {
            user_address: userAddress,
            challenge_id: challenge.challenge_id,
            status: ChallengeStatus.COMPLETE,
            points: points,
            game_id: gameIdInBigInt,
          },
          {
            onConflict: 'game_id,user_address,challenge_id',
            ignoreDuplicates: true,
          }
        )
        .select();

      if (claim.error) {
        throw claim.error;
      }

      // await createUserBadge(challenge.badge_id, userAddress, gameIdInBigInt);
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        { success: false, message: 'error-challenge' },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { success: false, message: 'failed-challenge' },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: 'challenge-completed' });
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORGINS.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// // creates badge for user if it exists on challenge
// async function createUserBadge(
//   badgeId: number,
//   userAddress: string,
//   gameIdInBigInt: bigint | null
// ) {
//   if (badgeId) {
//     const badgeUpsert = await supabase
//       .from('user_badges')
//       .upsert(
//         {
//           user_address: userAddress.toLowerCase(),
//           game_id: gameIdInBigInt,
//           badge_id: badgeId,
//         },
//         {
//           onConflict: 'game_id,user_address,badge_id',
//           ignoreDuplicates: true,
//         }
//       )
//       .select();

//     if (badgeUpsert.error) {
//       throw badgeUpsert.error;
//     }
//   }
// }

function getValidateFunction(challenge: ocsChallengeCard) {
  if (!challenge.contractAddress) {
    return undefined;
  }

  return challenge.tokenId ? checkTokenIdBalance : checkBalance;
}
