import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { toBigInt } from '@/utils/toBigInt';
import { ChallengeTypeEnum } from '@/hooks/types';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export type ChallengeType = {
  id: bigint;
  name: string;
  icon: string;
  description: string;
  contract_addresses: string[];
  image_url: string | null;
  game_id: bigint;
  cta_url: string | null;
  cta_text: string | null;
  cta_button_text: string | null;
  challenge_type: string;
  is_enabled: boolean;
  points: bigint;
  nft_amount: bigint | null;
};

export type Challenge = {
  id: bigint;
  name: string;
  contractAddresses: string[];
  icon: string;
  description: string;
  imageUrl: string | null;
  gameId: bigint;
  ctaUrl: string | null;
  ctaText: string | null;
  ctaButtonText: string | null;
  challengeType: string;
  isEnabled: boolean;
  points: bigint;
  nftAmount: bigint | null;
};

async function mapBoostState(challenge: ChallengeType): Promise<Challenge> {
  return {
    id: challenge.id as bigint,
    name: challenge.name,
    contractAddresses: challenge.contract_addresses,
    icon: challenge.icon,
    description: challenge.description,
    imageUrl: challenge.image_url,
    gameId: challenge.game_id as bigint,
    ctaUrl: challenge.cta_url,
    ctaText: challenge.cta_text,
    ctaButtonText: challenge.cta_button_text,
    challengeType: challenge.challenge_type,
    isEnabled: challenge.is_enabled,
    points: challenge.points,
    nftAmount: challenge.nft_amount,
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

  const challengesData = await supabase
    .from('challenge_configuration')
    .select(
      `
    *,
    completed_challenge (
      challenge_id,
      contract_address,
      updated_at
    )
  `
    )
    .eq('game_id', gameId)
    .eq('is_enabled', true)
    .filter('completed_challenge.user_address', 'eq', userAddress.toLowerCase())
    .or(
      `available_time.is.null,available_time.lte.${new Date().toISOString()}`
    );

  if (challengesData.error) {
    console.error(challengesData.error);
    throw new Error(challengesData.error.message);
  }

  const challenges = challengesData.data;

  const challengesFormatted = challenges.map(async (challenge) => {
    let isCompleted = false;
    const completedAddresses = challenge.completed_challenge
      .filter((b: { contract_address: string }) => b.contract_address)
      .map((b: { contract_address: string }) => b.contract_address);
    switch (challenge.boost_type) {
      case ChallengeTypeEnum.NFT:
      case ChallengeTypeEnum.NFT_PER_MINT:
        isCompleted = challenge.contract_addresses.some((a: string) =>
          completedAddresses.includes(a)
        );
        break;
      case ChallengeTypeEnum.TOKEN:
      case ChallengeTypeEnum.TRANSACTION:
      case ChallengeTypeEnum.TRANSFER_NFT:
      case ChallengeTypeEnum.SOCIAL:
      case ChallengeTypeEnum.DEFAULT:
        isCompleted = challenge.completed_challenge.every(
          (c: { challenge_id: number }) => c.challenge_id === challenge.id
        );
        break;
    }

    isCompleted = isCompleted && challenge.completed_challenge.length > 0;

    const mappedBoost = await mapBoostState(challenge);
    return { ...mappedBoost, isCompleted };
  });

  return Promise.all(challengesFormatted)
    .then((formattedChallenges) => {
      if (formattedChallenges) {
        formattedChallenges.sort((a: any, b: any) => {
          if (a.isCompleted === b.isCompleted) {
            return a.points - b.points; // Sort by points in ascending order if isClaimed is equal
          }
          return a.isCompleted ? 1 : -1;
        });
        const boostsResponse = formattedChallenges.filter((challenge) => {
          const isTransferNftAndClaimed =
            challenge.challengeType === ChallengeTypeEnum.TRANSFER_NFT &&
            challenge.isCompleted;
          const isNotTransferNft =
            challenge.challengeType !== ChallengeTypeEnum.TRANSFER_NFT;

          return isTransferNftAndClaimed || isNotTransferNft;
        });
        return NextResponse.json(boostsResponse);
      } else {
        return new Response(`No available boosts found for gameId: ${gameId}`, {
          status: 400,
        });
      }
    })
    .catch((error) => {
      return new Response(`No available boosts found for gameId: ${gameId}`, {
        status: 400,
      });
    });
}
