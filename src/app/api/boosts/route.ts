import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { hoursToMilliseconds } from 'date-fns';
import { toBigInt } from '@/utils/toBigInt';

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
);

export type BoostType = {
  id: bigint;
  name: string;
  contract_addresses: string[];
  image_url: string | null;
  game_id: bigint;
  cta_url: string | null;
  cta_text: string | null;
  boost_type: string;
  is_enabled: boolean;
  points: bigint;
  nft_amount: bigint | null;
};

export type Boost = {
  id: bigint;
  name: string;
  contractAddresses: string[];
  imageUrl: string | null;
  gameId: bigint;
  ctaUrl: string | null;
  ctaText: string | null;
  boostType: string;
  isEnabled: boolean;
  points: bigint;
  nftAmount: bigint | null;
};

async function mapBoostState(
  boost: BoostType
): Promise<Boost> {
  return {
    id: boost.id as bigint,
    name: boost.name,
    contractAddresses: boost.contract_addresses,
    imageUrl: boost.image_url,
    gameId: boost.game_id as bigint,
    ctaUrl: boost.cta_url,
    ctaText: boost.cta_text,
    boostType: boost.boost_type,
    isEnabled: boost.is_enabled,
    points: boost.points,
    nftAmount: boost.nft_amount
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
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

  const now = new Date().toISOString();

  const boostsData = await supabase
  .from('boost_configuration')
  .select(`
    *,
    claimed_boost (
      boost_id,
      contract_address,
      updated_at
    )
  `)
  .eq('game_id', gameId)
  .eq('is_enabled', true)
  .filter('claimed_boost.user_address', 'eq', userAddress)
  .or(`available_time.is.null,available_time.lte.${now}`);

  if (boostsData.error) {
    console.error(boostsData.error);
    throw new Error(boostsData.error.message);
  }

  const boosts = boostsData.data;

  const boostsFormatted = boosts.map(async boost => {
    let isClaimed = false;
    let autoClaimed = false;
    const claimedAddresses = boost.claimed_boost.filter((b: { contract_address: string; }) => b.contract_address).map((b: { contract_address: string; }) => b.contract_address);
    switch (boost.boost_type) {
        case 'NFT':
        case 'NFT_PER_MINT':
            isClaimed = boost.contract_addresses.every((a: string) => claimedAddresses.includes(a));
            break;
        case 'TOKEN':
        case 'TRANSACTION':
        case 'TRANSFER_NFT':
        case 'DEFAULT':
          isClaimed = boost.claimed_boost.every((c: { boost_id: any; }) => c.boost_id === boost.id);
          break;
    }

    isClaimed = isClaimed && boost.claimed_boost.length > 0;

    const mappedBoost = await mapBoostState(boost);
    return { ...mappedBoost, claimed: isClaimed };
  });

  return Promise.all(boostsFormatted).then(formattedBoosts => {
    if (formattedBoosts) {
      formattedBoosts.sort((a, b) => {
        if (a.claimed && !b.claimed) return 1;
        if (!a.claimed && b.claimed) return -1;
        return 0;
      });
      const boostsResponse = formattedBoosts.filter(boost => {
        const isTransferNftAndClaimed = boost.boostType === 'TRANSFER_NFT' && boost.claimed;
        const isNotTransferNft = boost.boostType !== 'TRANSFER_NFT';
      
        return isTransferNftAndClaimed || isNotTransferNft;
      });
      return NextResponse.json(boostsResponse);
    } else {
      return new Response(`No available boosts found for gameId: ${gameId}`, {
        status: 400,
      });
    }

  }).catch(error => {
    return new Response(`No available boosts found for gameId: ${gameId}`, {
      status: 400,
    });
  });
}