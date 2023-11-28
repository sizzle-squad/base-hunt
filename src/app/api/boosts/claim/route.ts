import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { Network, Alchemy, TokenBalance } from "alchemy-sdk";
import { hoursToMilliseconds } from 'date-fns';

const settings = {
    apiKey: process.env.ALCHEMY_ID,
    network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

async function ownsNFT(userAddress: string, contract: string) {
    const response = await alchemy.nft.verifyNftOwnership(userAddress, contract);
    return response;
}

async function hasToken(userAddress: string, contract: string) {
    const tokenBalanceRes = await alchemy.core.getTokenBalances(userAddress, [contract]);
    const filterByBalance = tokenBalanceRes.tokenBalances.filter((balance: TokenBalance) => Number(balance.tokenBalance) > 0);
    return filterByBalance.length > 0;
}

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
);

export type BoostsClaimRequest = {
  gameId: string;
  userAddress: string;
  boostId: string;
  contractAddress: string;
};

export async function POST(request: NextRequest) {
  const body: BoostsClaimRequest = await request.json();

  const { gameId, userAddress, boostId, contractAddress } = body;

  if (!userAddress || !gameId || !boostId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, boostId: ${boostId}`,
      {
        status: 400,
      }
    );
  }

  const gameIdInBigInt = BigInt(gameId as string);
  const boostIdInBigInt = BigInt(boostId as string);

  const boostData = await supabase
  .from('boost_configuration')
  .select(`
    *,
    claimed_boost (
      boost_id,
      updated_at
    )
  `)
  .eq('id', boostIdInBigInt)
  .eq('game_id', gameIdInBigInt)
  .eq('is_enabled', true)
  .single();

  if (boostData.error) {
    console.error(boostData.error);
    throw new Error(boostData.error.message);
  }

  const boost = boostData.data;

  if (!boost) {
    return new Response(`No available boost ${boostId} found for gameId: ${gameId}`, {
        status: 400,
      });
  }
  
  if (boost.boost_type === 'NFT' || boost.boost_type === 'NFT_PER_MINT' || boost.boost_type === 'TOKEN') {
    if (!contractAddress) {
        return new Response(
          `Missing parameters: contractAddress: ${contractAddress} for boost type ${boost.boost_type}`,
          {
            status: 400,
          }
        );
      }
  }

  let verified = false;
  switch (boost.boost_type) {
    case 'NFT':
    case 'NFT_PER_MINT':
        verified = await ownsNFT(userAddress, contractAddress);
        break;
    case 'TOKEN':
        verified = await hasToken(userAddress, contractAddress);
        break;
    case 'RECURRING':
        const activeClaims = boost.claimed_boost.filter(c => {
            const refreshHours = boost.refresh_time ? boost.refresh_time.getHours() : 24;
            const expirationTime = new Date(c.updated_at.getTime() + hoursToMilliseconds(refreshHours));
            return new Date() < expirationTime;
        });
        verified = activeClaims.length == 0;
        break;
  }

  if (!verified) return new Response(`Unable to claim boost for boostId: ${boostId}, gameId: ${gameId}.`, { status: 400 });
  const { data: claimedBoost, error } = await supabase
  .from('claimed_boost')
  .insert([{
    user_address: userAddress,
    boost_id: boost.id,
    game_id: gameIdInBigInt,
    contract_address: contractAddress ? contractAddress : null
  }])
  .single();

  if (error) {
    if (error.code === '23505') {
      return new Response(`Boost already claimed for boostId: ${boostId}, gameId: ${gameId}.`, { status: 400 });
    }
    return new Response(`Unable to claim boost for boostId: ${boostId}, gameId: ${gameId}.`, { status: 400 });
  }

  return NextResponse.json({ claimedBoost, status: 'ok' });
}