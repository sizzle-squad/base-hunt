import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { CheckFunctions, ValidateBodyParams } from '@/utils/claims/selectors';
import { providers } from '@/utils/ethereum';
import { toBigInt } from '@/utils/toBigInt';

const ALLOWED_ORGINS = process.env.ALLOWED_ORGINS?.split(',') ?? [];

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export type BadgeClaimRequest = {
  gameId: string;
  userAddress: string;
  badgeId: string;
};

export interface BadgeData {
  id: number;
  name: string;
  game_id: number;
  function_type: any;
  contract_address: string;
  params: BadgeParams;
  network: string;
}

export interface BadgeParams {
  tokenId: string;
  tokenAmount: Number;
}

export async function POST(request: NextRequest) {
  const body: BadgeClaimRequest = await request.json();

  const { gameId, userAddress, badgeId } = body;

  if (!userAddress || gameId === undefined || !badgeId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, badgeId: ${badgeId}`,
      {
        status: 400,
      }
    );
  }

  const gameIdInBigInt = toBigInt(gameId as string);
  const badgeIdInBigInt = toBigInt(badgeId as string);
  const badgeData = await supabase
    .from('badge_configuration')
    .select('*')
    .eq('game_id', gameIdInBigInt)
    .eq('id', badgeIdInBigInt);

  if (badgeData.error || badgeData.data.length == 0) {
    console.error(badgeData.error);
    return new Response(
      `Unable to find badge for badgeId: ${badgeIdInBigInt}, gameId: ${gameId}.`,
      { status: 400 }
    );
  }

  const badge = badgeData.data[0] as any as BadgeData;

  const tokenId = badge?.params?.tokenId;
  const contractAddress = badge?.contract_address;
  const tokenAmount = badge?.params?.tokenAmount;
  const provider = providers[badge.network as keyof typeof providers];

  const checkFunctionType =
    CheckFunctions[badge.function_type as keyof typeof CheckFunctions];
  if (checkFunctionType === undefined) {
    console.error('check function is undefined:' + ' badge id:' + badgeId);

    return NextResponse.json(
      {
        success: false,
        message: 'invalid-check-function',
      },
      { status: 405 }
    );
  }

  if (
    !ValidateBodyParams[badge.function_type as keyof typeof CheckFunctions](
      body
    )
  ) {
    console.error(
      'invalid body params for challenge:' +
        badgeId +
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
    contractAddress,
    tokenAmount,
    tokenId,
    network: provider,
  };

  let userCompletedBadge = await checkFunctionType(checkFuncData, provider);

  if (userCompletedBadge) {
    try {
      await createUserBadge(badge.id, userAddress, gameIdInBigInt);
    } catch (e) {
      console.error(e);
      return NextResponse.json(
        { success: false, message: 'error-badge' },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { success: false, message: 'failed-badge' },
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

// creates badge for user if it exists on challenge
async function createUserBadge(
  badgeId: number,
  userAddress: string,
  gameIdInBigInt: bigint | null
) {
  if (badgeId) {
    const badgeUpsert = await supabase
      .from('user_badges')
      .upsert(
        {
          user_address: userAddress.toLowerCase(),
          game_id: gameIdInBigInt,
          badge_id: badgeId,
        },
        {
          onConflict: 'game_id,user_address,badge_id',
          ignoreDuplicates: true,
        }
      )
      .select();

    if (badgeUpsert.error) {
      throw badgeUpsert.error;
    }
  }
}
