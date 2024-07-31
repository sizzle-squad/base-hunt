import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { WALLET_API_BASE_URL } from '@/utils/constants';
import { authenticate } from '@/app/middleware/auth';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

const baseUSDCAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const euroUSDCAddress = '0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42';

export type OnboardingLeaderboardRequest = {
  txHash: string;
  userAddress: string;
  chainId: string;
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

type Transfer = {
  fromAddress: string;
  toAddress: string;
  assetAddress: string;
  amount: string;
  tokenId: string;
};

type Transaction = {
  transfers: Transfer[];
};

type AddressMeta = {
  token: Token | null;
};

type Token = {
  symbol: string;
  logo: Logo;
};

type Logo = {
  url: string;
};

type TransactionDetailsResponse = {
  result: {
    transaction: Transaction;
    addressMeta: {
      [key: string]: AddressMeta;
    };
  };
};

async function getTxDetails(txHash: string, address: string) {
  const url = `${WALLET_API_BASE_URL}/rpc/v3/txHistory/getTransactionDetails`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        network: 'networks/base-mainnet',
        hash: txHash,
        address,
      }),
    });

    if (!response.ok) {
      console.error(
        'Coinbase API TransactionDetailsResponse fetch failed:',
        response.status
      );
      return null;
    }

    const result: TransactionDetailsResponse = await response.json();
    return result.result;
  } catch (error) {
    console.error(
      'Coinbase API TransactionDetailsResponse fetch failed:',
      error
    );
    return null;
  }
}

export async function POST(request: NextRequest) {
  const authResponse = await authenticate(request, async () =>
    NextResponse.next()
  );
  if (authResponse.status !== 200) {
    return authResponse;
  }

  const { userAddress, txHash, chainId }: OnboardingLeaderboardRequest =
    await request.json();

  if (!userAddress || !txHash) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, txHash: ${txHash}, chainId: ${chainId}`,
      {
        status: 400,
      }
    );
  }
  if (chainId !== '8453') {
    // only want to support base, return success early
    return NextResponse.json({ success: true });
  }

  const txDetails = await getTxDetails(txHash, userAddress);

  let assetAddress =
    txDetails?.transaction?.transfers[
      txDetails?.transaction?.transfers.length - 1
    ]?.assetAddress;
  if (!assetAddress) {
    console.error('Transaction not found:', txHash);
    return new Response(`Transfers not found for txHash: ${txHash}`, {
      status: 400,
    });
  }

  if (
    assetAddress == 'native' ||
    assetAddress.toLowerCase() == baseUSDCAddress.toLowerCase() ||
    assetAddress.toLowerCase() == euroUSDCAddress.toLowerCase()
  ) {
    // don't want to process ETH or USDC, return success early
    return NextResponse.json({ success: true });
  }

  let addressMeta = txDetails?.addressMeta[assetAddress];
  if (!addressMeta) {
    console.error('AddressMeta not found:', txHash, assetAddress);
    return new Response(
      `AddressMeta not found for tx hash ${txHash} and assetAddress: ${assetAddress}`,
      {
        status: 400,
      }
    );
  }

  const { error: findOrCreateCommunityError } = await supabase.rpc(
    'find_or_create_community',
    {
      _asset_address: assetAddress,
      _symbol: addressMeta.token?.symbol ?? 'TBA',
      _logo: addressMeta.token?.logo?.url ?? '',
    }
  );
  if (findOrCreateCommunityError) {
    console.error(
      'Error finding or creating community:',
      findOrCreateCommunityError
    );
    return new Response('Error finding or creating community', { status: 500 });
  }

  const { error } = await supabase.from('user_onboarding').insert([
    {
      user_address: userAddress.toLowerCase(),
      asset_address: assetAddress.toLowerCase(),
      tx_hash: txHash,
    },
  ]);

  if (error) {
    console.error('Error inserting data:', error);
    return new Response('Error inserting data', { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: NextRequest) {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .neq('symbol', 'TBA')
    .order('num_onboarded', { ascending: false })
    .limit(10);

  if (error) {
    return new Response(`Unable to fetch onboarding leaderboard`, {
      status: 400,
    });
  }

  const result = data.map((entry) => ({
    symbol: entry.symbol,
    logo: entry.logo,
    numOnboarded: entry.num_onboarded,
  }));

  const response = NextResponse.json(result);

  // cache for 10 seconds
  response.headers.set('Cache-Control', 'public, s-maxage=20');
  response.headers.set('CDN-Cache-Control', 'public, s-maxage=20');
  response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=20');

  return response;
}
