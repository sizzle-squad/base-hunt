import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { Alchemy, Network } from 'alchemy-sdk';

import { ChallengeTypeEnum } from '@/hooks/types';
import {
  CheckFunctions,
  MapChallengeTypeUserAddress,
  ValidateBodyParams,
} from '@/utils/claims/selectors';
import {
  ChallengeStatus,
  ChallengeType,
  Networks,
} from '@/utils/database.enums';
import { providers } from '@/utils/ethereum';
import { toBigInt } from '@/utils/toBigInt';
import { WALLET_API_BASE_URL } from '@/utils/constants';

class Blockscout {
  apiKey: string | undefined;
  domain: string;
  network: string;

  constructor(settings: {
    apiKey: string | undefined;
    domain: string;
    network: string;
  }) {
    this.apiKey = settings.apiKey;
    this.domain = settings.domain;
    this.network = settings.network;
  }

  async fetch(
    action: string,
    params = { startblock: 0, endblock: 99999999, sort: 'desc' }
  ) {
    try {
      let url = `https://${this.network}.${this.domain}/api?module=account&action=${action}&apikey=${this.apiKey}`;
      for (const [key, value] of Object.entries(params)) {
        url += value ? `&${key}=${value}` : '';
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getExternalTransfers(
    params: { startblock: number; endblock: number; sort: string } | undefined
  ) {
    return await this.fetch('txlist', params);
  }

  async getERC20Transfers(
    params: { startblock: number; endblock: number; sort: string } | undefined
  ) {
    return await this.fetch('tokentx', params);
  }

  async getAssetTransfers(params: {
    categories: string[];
    startblock: number;
    endblock: number;
    sort: string;
  }) {
    const { categories } = params;
    let transfers: any[] = [];
    for (const category of categories) {
      if (category === 'external') {
        const externalTransfers = await this.getExternalTransfers(params);
        transfers = [...transfers, ...externalTransfers.result];
      } else if (category === 'erc20') {
        const erc20Transfers = await this.getERC20Transfers(params);
        transfers = [...transfers, ...erc20Transfers.result];
      }
    }
    return transfers;
  }
}

const blockscoutSettings = {
  apiKey: process.env.BLOCKSCOUT_API_KEY,
  domain: 'blockscout.com',
  network: 'base',
};

const blockscout = new Blockscout(blockscoutSettings);

const settings = {
  apiKey: process.env.ALCHEMY_ID,
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

async function verifyNftOwnership(userAddress: string, contracts: string[]) {
  const response = await alchemy.nft.verifyNftOwnership(userAddress, contracts);
  return response;
}

async function hasToken(
  userAddress: string,
  contract: string,
  threshold: number
) {
  const tokenBalanceRes = await alchemy.core.getTokenBalances(userAddress, [
    contract,
  ]);
  const metadata = await alchemy.core.getTokenMetadata(contract);
  const filterByBalance = tokenBalanceRes.tokenBalances.filter(
    (balance) =>
      Number(balance.tokenBalance) /
        Math.pow(10, metadata.decimals as number) >=
      threshold
  );
  return filterByBalance.length > 0;
}

async function verifyTransactions(
  toAddress: string,
  fromAddress: string,
  contractAddress: string
) {
  const params = {
    address: fromAddress,
    contractAddress,
    categories: ['external', 'erc20'],
  };
  const response = await blockscout.getAssetTransfers(params as any);
  const transfers = response.filter(
    (transfer) => transfer.to.toLowerCase() === toAddress.toLowerCase()
  );
  return transfers.length > 0;
}

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

type ExploreContentResponse = {
  content: {
    ocsChallengeCard: {
      contractAddress: string;
      tokenId: string;
      points: number;
    };
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
    await createUserBadge(challenge.badge_id, userAddress, gameIdInBigInt);
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

  let checkFunc =
    CheckFunctions[challenge.function_type as keyof typeof CheckFunctions];
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

  const exploreContent = await getContentByIdUnauth(exploreChallengeId);
  if (!exploreContent) {
    console.error(
      `explore content not found for exploreChaellengeId: ${exploreChallengeId}`
    );
    return new Response(
      `Unable to claim challenge for challengeId: ${challengeId}, gameId: ${gameId}.`,
      { status: 400 }
    );
  }

  const tokenId = exploreContent?.ocsChallengeCard?.tokenId;
  const contractAddress = exploreContent?.ocsChallengeCard?.contractAddress;
  const points = exploreContent?.ocsChallengeCard?.points;

  const network = challenge.network as Networks;
  const provider = providers[network];

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

  let challengeType =
    ChallengeType[challenge.type as keyof typeof ChallengeType];
  if (challengeType === undefined) {
    console.error(`challenge type is undefined:` + challenge.type);
    return NextResponse.json(
      {
        success: false,
        message: 'invalid-challenge=type',
      },
      { status: 405 }
    );
  }

  const { params } = challenge;
  params.tokenId = tokenId;
  const checkFuncData = {
    ...body,
    ...challenge,
    contract_address: contractAddress,
    params,
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
            challenge_id: challenge.id,
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

      await createUserBadge(challenge.badge_id, userAddress, gameIdInBigInt);
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

  return NextResponse.json({ success: true, message: 'ok' });
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
