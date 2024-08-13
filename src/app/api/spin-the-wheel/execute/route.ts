import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import axios from 'axios';

import { createClient } from '@supabase/supabase-js';
import {
  AirdropUSDCValue,
  SpinData,
  SpinOption,
  SpinOptionTypeEnum,
  SpinTheWheelState,
} from '../../../../hooks/types';
import {
  airdropUSDC,
  getAllSpins,
  getEnabledSpins,
  getRandomOutcome,
  getUserSpinData,
  UserSpinType,
} from '../spinHelper';

type userChallengeStatusDataType = {
  user_address: string;
  challenge_id: string;
};

const ALLOWED_ORGINS = process.env.ALLOWED_ORGINS?.split(',') ?? [];
const blockedFundedByAddresses =
  process.env.STW_BLOCKED_FUNDED_BY_ADDRESSES?.split(',') ?? [];
const riskyChallengeIds = process.env.STW_RISKY_CHALLENGE_IDS?.split(',') ?? [];

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

type SpinTheWheelExecuteRequest = {
  gameId: string;
  userAddress: string;
};

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

export async function POST(request: NextRequest) {
  const body: SpinTheWheelExecuteRequest = await request.json();

  const { gameId, userAddress } = body;
  if (!userAddress || gameId === null) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  try {
    // bandaid fix for users who only got points from a free mint
    const { data: userChallengeStatusData, error } = await supabase
      .from('user_challenge_status')
      .select('user_address, status, challenge_id', { count: 'exact' })
      .eq('game_id', gameId)
      .eq('user_address', userAddress.toLowerCase());

    if (error) {
      console.error(error);
      return new Response(`Error fetching user info`, { status: 400 });
    }

    if (await shouldBlockSpin(userChallengeStatusData, userAddress)) {
      return new Response('No spin available', { status: 400 });
    }

    const spinDataRes = await supabase.rpc('getspindata', {
      _game_id: gameId,
      _user_address: userAddress.toLowerCase(),
    });

    if (spinDataRes.error) {
      console.error(spinDataRes.error);
      throw new Error(spinDataRes.error.message);
    }

    let spinOptions = getAllSpins(spinDataRes.data['spinOptions']);
    let spinData = getUserSpinData(spinDataRes.data['spinData'], spinOptions);

    const isEligibleForSpinTheWheel = await eligibleForSpinTheWheel(
      spinData,
      userAddress,
      BigInt(gameId)
    );
    if (!isEligibleForSpinTheWheel) {
      return new Response(
        `User does not have enough points, not eligible for STW: ${userAddress}, gameId: ${gameId}`,
        {
          status: 400,
        }
      );
    }

    let currentlyEnabledSpins = getEnabledSpins(
      spinDataRes.data['spinOptions']
    );
    const userHasAvailableSpin = spinData.hasAvailableSpin;

    if (!userHasAvailableSpin) {
      return new Response(
        `No available spin for userAddress: ${userAddress}, gameId: ${gameId}`,
        {
          status: 400,
        }
      );
    }
    const generatedSpin = getRandomOutcome(currentlyEnabledSpins);
    if (generatedSpin.type == SpinOptionTypeEnum.USDC) {
      const payouts = (await supabase.rpc('get_recent_payouts'))?.data;
      if (payouts && payouts >= 6000) {
        console.error('Too many payouts');
        return new Response(
          `Too many payouts have been made recently, please try again later`,
          {
            status: 400,
          }
        );
      }
    }
    const saveSpin = await supabase.rpc('update_spin_and_points', {
      _game_id: gameId,
      _user_address: userAddress.toLowerCase(),
      _last_spin_id: generatedSpin.id,
      _points_increment:
        generatedSpin.type == SpinOptionTypeEnum.POINTS
          ? generatedSpin.points
          : 0,
    });

    if (saveSpin.error) {
      console.error(saveSpin.error);
      throw new Error(saveSpin.error.message);
    }

    if (!saveSpin.data) {
      console.error(
        `Unable to save spin for userAddress: ${userAddress}, gameId: ${gameId}`
      );
      return new Response(
        `Unable to save spin for userAddress: ${userAddress}, gameId: ${gameId}`,
        {
          status: 400,
        }
      );
    }

    let userSpin = saveSpin.data as UserSpinType;
    const updatedSpin: SpinData = {
      id: userSpin.id.toString(),
      gameId: userSpin.game_id.toString(),
      userAddress: userSpin.user_address,
      hasAvailableSpin: false,
      lastSpinResult: generatedSpin,
    };

    if (generatedSpin.type == SpinOptionTypeEnum.USDC) {
      const headers: Record<string, string> = {};
      if (request.headers) {
        request.headers.forEach((value, key) => {
          headers[key] = value;
        });
        console.log('[AirdropUSDC] Request headers:', headers);
      } else {
        console.log('[AirdropUSDC] Request headers not found');
      }

      if (generatedSpin.points == 5) {
        airdropUSDC(userAddress, AirdropUSDCValue.FIVE);
      } else if (generatedSpin.points == 10) {
        airdropUSDC(userAddress, AirdropUSDCValue.TEN);
      } else if (generatedSpin.points == 100) {
        airdropUSDC(userAddress, AirdropUSDCValue.ONE_HUNDRED);
      }
    }

    return NextResponse.json(
      mapToSpinTheWheelState(updatedSpin, currentlyEnabledSpins)
    );
  } catch (e) {
    console.error(e);
    NextResponse.error();
  }
}

function mapToSpinTheWheelState(
  spinData: SpinData,
  spinOptions: SpinOption[]
): SpinTheWheelState {
  return {
    spinOptions: spinOptions,
    spinData: spinData,
  };
}

async function eligibleForSpinTheWheel(
  spinData: SpinData,
  userAddress: string,
  gameIdInBigInt: bigint
): Promise<boolean> {
  if (spinData.lastSpinResult != null) {
    // if user already has a spin, that means they already have enough points
    // no need to check points for that case
    return true;
  }
  const { data: scoreData, error: statusError } = await supabase
    .from('score')
    .select('*')
    .eq('user_address', userAddress.toLowerCase())
    .eq('game_id', gameIdInBigInt)
    .single();

  if (statusError || !scoreData || scoreData.current_score < 250) {
    return false;
  }

  return true;
}

async function shouldBlockSpin(
  userChallengeStatusData: userChallengeStatusDataType[],
  userAddress: string
): Promise<boolean> {
  if (userChallengeStatusData.length > 4) {
    // user completed more than 4 challenges, likely not a bot
    return false;
  }

  const txHistoryResult = await axios.post(
    'https://api.wallet.coinbase.com/rpc/v3/txHistory/getForAddress',
    {
      network: 'networks/base-mainnet',
      address: userAddress,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (interactedWithBlockedAddresses(txHistoryResult)) {
    console.error(
      `User ${userAddress} spin blocked: interacted with blocked addresses`
    );
    return true;
  }

  let numNonRiskyChallengesCompleted = 0;
  for (const challenge of userChallengeStatusData) {
    if (!riskyChallengeIds.includes(challenge.challenge_id)) {
      numNonRiskyChallengesCompleted++;
    }
  }

  if (numNonRiskyChallengesCompleted !== 0) {
    // user has completed some non risky challenges, likely not a bot
    return false;
  }

  if (hasNoMintAction(txHistoryResult)) {
    console.error(`User ${userAddress} spin blocked: no mint action`);
    return true;
  }

  return false;
}

function interactedWithBlockedAddresses(txHistoryResult: any): boolean {
  if (txHistoryResult.data.result.addressMeta) {
    for (const address in txHistoryResult.data.result.addressMeta) {
      if (blockedFundedByAddresses.includes(address.toLowerCase())) {
        return true;
      }
    }
  }
  return false;
}

function hasNoMintAction(txHistoryResult: any): boolean {
  if (txHistoryResult.data.result.transactions) {
    var hasMintAction = false;
    for (const tx of txHistoryResult.data.result.transactions) {
      // check all user operations for mint action
      for (const userOp in tx.userOperations) {
        const uOp: any = userOp;
        if (uOp?.primaryAction?.type === 'LABEL_MINT') {
          hasMintAction = true;
        }
      }
      // check all tx for mint action
      if (tx.primaryAction === 'LABEL_MINT') {
        hasMintAction = true;
      }
    }
    if (hasMintAction) {
      // user has minted, likely not a bot
      return false;
    } else {
      return txHistoryResult.data.result.transactions.length < 5;
    }
  }
  return false;
}
