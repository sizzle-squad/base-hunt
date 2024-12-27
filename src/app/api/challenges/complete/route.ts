import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import axios from 'axios';

const customAxios = axios.create({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'https://www.coinbase.com',
    'Referer': 'https://www.coinbase.com/',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'Connection': 'keep-alive'
  },
  withCredentials: true
});

import {
  CheckFunctions,
  MapChallengeTypeUserAddress,
  ValidateBodyParams,
} from '@/utils/claims/selectors';
import { ChallengeStatus, CheckFunctionType } from '@/utils/database.enums';
import { providers } from '@/utils/ethereum';
import { toBigInt } from '@/utils/toBigInt';
import { getContentByIdUnauth } from '@/utils/getContentByIdUnauth';
import { verifyOwnershipByCollectionUrl } from '@/utils/claims/balanceCheck';

const ALLOWED_ORGINS = process.env.ALLOWED_ORGINS?.split(',') ?? [];
const maxPointMultiplier = 20;

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
  game_id: number;
  challenge_id: string;
  user_challenge_status: Status[];
}

export interface Status {
  status: string;
  user_address: string;
}

export type ocsChallengeCard = {
  contractAddress: string;
  tokenId: string;
  points: number;
  tokenAmount: string;
  creatorName: string;
};

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
  const userChallengeStatusData = await supabase
    .from('user_challenge_status')
    .select('user_address, status')
    .eq('game_id', gameIdInBigInt)
    .eq('user_address', userAddress.toLowerCase())
    .eq('challenge_id', challengeId);

  if (userChallengeStatusData.error) {
    console.error(userChallengeStatusData.error);
    return new Response(
      `Unable to claim challenge for challengeId: ${challengeId}, gameId: ${gameId}.`,
      { status: 400 }
    );
  }

  const challengeStatus = userChallengeStatusData.data;

  if (challengeStatus.length > 0) {
    //challenge already claimed
    console.log(`challenge already claimed: ${challengeStatus[0].status}`);
    // await createUserBadge(challenge.badge_id, userAddress, gameIdInBigInt);
    return NextResponse.json({ success: true, message: 'challenge-claimed' });
  }

  const exploreContent = await getContentByIdUnauth(challengeId);
  if (!exploreContent) {
    console.error(
      `explore content not found for exploreChaellengeId: ${challengeId}`
    );
    return new Response(
      `Experience not found for challengeId: ${challengeId}, gameId: ${gameId}.`,
      { status: 400 }
    );
  }

  const tokenId = exploreContent?.ocsChallengeCard?.tokenId;
  const contractAddress = exploreContent?.ocsChallengeCard?.contractAddress;
  var points = exploreContent?.ocsChallengeCard?.points;
  const tokenAmount = exploreContent?.ocsChallengeCard?.tokenAmount || '1';

  // Provider is always base mainnet
  const provider = providers['networks/base-mainnet'];

  const hasAPIKey = verifyAPISecret(request, challengeId);

  const checkFunctionType = hasAPIKey
    ? CheckFunctionType.checkBypass
    : getValidateFunctionType(
        exploreContent.ocsChallengeCard as ocsChallengeCard
      );

  if (checkFunctionType === undefined) {
    console.error(
      'check function is undefined:' + ' challenge id:' + challengeId
    );

    return NextResponse.json(
      {
        success: false,
        message: 'invalid-check-function',
      },
      { status: 405 }
    );
  }

  const checkFunc = CheckFunctions[checkFunctionType];

  if (
    !ValidateBodyParams[checkFunctionType as keyof typeof CheckFunctions](body)
  ) {
    console.error(
      'invalid body params for challenge:' +
        challengeId +
        ' function type:' +
        checkFunctionType
    );
    return NextResponse.json(
      {
        success: false,
        message: 'invalid-body-params',
      },
      { status: 405 }
    );
  }

  const checkFuncData = {
    ...body,
    ...challengeStatus,
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
          checkFunctionType as keyof typeof CheckFunctions
        ](checkFuncData);
      if (userAddress === undefined) {
        throw new Error(
          'user address could not be mapped and is undefined:' + checkFuncData
        );
      }

      // hardcoded only for coffee challenge
      if (challengeId === 'ocsChallenge_9142cba1-ec12-4ee8-915e-7976536908cd') {
        points =
          (await pointsMultiplier(userAddress, contractAddress)) * points;
      }

      const claim = await supabase
        .from('user_challenge_status')
        .upsert(
          {
            user_address: userAddress,
            challenge_id: challengeId,
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
    } catch (e) {
      console.error(e, challengeId);
      return NextResponse.json(
        { success: false, message: 'error-challenge' },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { success: false, message: 'failed-challenge' },
      { status: 200 }
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

function getValidateFunctionType(challenge: ocsChallengeCard) {
  if (challenge.creatorName.toLocaleLowerCase().includes('coinbase one')) {
    return CheckFunctionType.checkCoinbaseOne;
  }

  if (!challenge.contractAddress) {
    return undefined;
  }

  return CheckFunctionType.checkTokenIdBalance;
}

function verifyAPISecret(req: Request, challengeId: string): boolean {
  const secret = process.env.GALLERY_SECRET;
  const allowedChallengeIds = process.env.BYPASS_CHALLENGE_IDS?.split(',');
  const headerSecret = req.headers.get('x-bypass-challenge-secret');

  if (!secret) {
    console.warn('API_SECRET not set');
    return false;
  }

  if (!headerSecret) {
    return false;
  }
  return (
    secret === headerSecret &&
    Boolean(allowedChallengeIds?.includes(challengeId))
  );
}

async function pointsMultiplier(
  userAddress: string,
  contractAddress: string
): Promise<number> {
  const result = await customAxios.post(
    verifyOwnershipByCollectionUrl,
    {
      claimer: userAddress,
      contractAddress: contractAddress,
      chainId: '8453',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Appsflyer-Id': 'web'
      }
    }
  );
  let total = 0;
  if (result.data.tokenCounts) {
    for (const [_, value] of Object.entries(result.data.tokenCounts)) {
      total += Number(value);
    }

    return total > maxPointMultiplier ? maxPointMultiplier : total;
  } else {
    return 1;
  }
}
