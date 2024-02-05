import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { toBigInt } from '@/utils/toBigInt';
import { Challenge, ChallengeTypeEnum } from '@/hooks/types';
import { Database, Tables, Enums } from '@/utils/database.types';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export type ContentDataType = {
  icon: string;
  description: string;
  image_url: string | null;
  game_id: bigint;
  cta_url: string | null;
  cta_text: string | null;
  cta_button_text: string | null;
};

async function mapChallengeState(
  challenge: Tables<'challenge_configuration'>
): Promise<Challenge> {
  // forced to use unknown because of lack of support in Supabase type mapping
  const {
    icon,
    description,
    image_url,
    game_id,
    cta_url,
    cta_text,
    cta_button_text,
  } = challenge.content_data as unknown as ContentDataType;

  return {
    id: challenge.id,
    name: challenge.display_name,
    contractAddress: challenge.contract_address,
    icon,
    description,
    imageUrl: image_url,
    gameId: game_id as bigint,
    ctaUrl: cta_url,
    ctaText: cta_text,
    ctaButtonText: cta_button_text,
    challengeType: challenge.type,
    isEnabled: challenge.is_enabled,
    points: challenge.points,
    type: challenge.type,
    checkFunction: challenge.function_type,
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
    user_challenge_status (
      challenge_id,
      user_address
    )
  `
    )
    .eq('game_id', gameId)
    .eq('is_enabled', true)
    .filter(
      'user_challenge_status.user_address',
      'eq',
      userAddress.toLowerCase()
    );

  if (challengesData.error) {
    console.error(challengesData.error);
    throw new Error(challengesData.error.message);
  }

  const challenges = challengesData.data;

  const challengesFormatted = challenges.map(async (challenge) => {
    let isCompleted = false;
    // const completedAddresses = challenge.user_challenge_status
    //   .filter((b: { user_address: string }) => b.user_address)
    //   .map((b: { user_address: string }) => b.user_address);
    // switch (challenge.type) {
    //   case ChallengeTypeEnum.TRANSFER_NFT_721:
    //   case ChallengeTypeEnum.TRANSFER_NFT_1155:
    //     if (challenge.contract_address) {
    //       isCompleted = completedAddresses.includes(challenge.contract_address);
    //     }
    //     break;
    //   case ChallengeTypeEnum.TOKEN:
    //   case ChallengeTypeEnum.CONTRACT_EXECUTION:
    //   case ChallengeTypeEnum.TRANSFER_NFT:
    //   case ChallengeTypeEnum.SOCIAL:
    //     isCompleted = challenge.completed_challenge.every(
    //       (c: { challenge_id: number }) => c.challenge_id === challenge.id
    //     );
    //     break;
    // }

    // isCompleted = isCompleted && challenge.completed_challenge.length > 0;
    const mappedChallenge = await mapChallengeState(challenge);
    return { ...mappedChallenge, isCompleted };
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
        const challengeResponse = formattedChallenges.filter((challenge) => {
          // const isTransferNftAndClaimed =
          //   challenge.challengeType === ChallengeTypeEnum.TRANSFER_NFT_721 ||
          //   challenge.challengeType === ChallengeTypeEnum.TRANSFER_NFT_1155;
          // challenge.isCompleted;
          const isNotTransferNft =
            challenge.challengeType !== ChallengeTypeEnum.TRANSFER_NFT_721 &&
            challenge.challengeType !== ChallengeTypeEnum.TRANSFER_NFT_1155;

          return isNotTransferNft;
        });

        return NextResponse.json(challengeResponse);
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
