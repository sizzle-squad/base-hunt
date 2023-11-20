import { PrismaClient } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { Network, Alchemy } from "alchemy-sdk";

const settings = {
    apiKey: process.env.ALCHEMY_ID,
    network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

export async function ownsNFT(userAddress: string, contract: string) {
    const response = await alchemy.nft.verifyNftOwnership(userAddress, contract);
    return response;
}

export async function hasToken(userAddress: string, contract: string) {
    const contracts = [contract];

    const tokenBalanceRes = await alchemy.core.getTokenBalances(userAddress, contracts);
    const filterByBalance = tokenBalanceRes.tokenBalances.filter((balance: any) => Number(balance.tokenBalance) > 0);
    return filterByBalance.length > 0;
}

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress') as string;
  const gameId = BigInt(searchParams.get('gameId') as string);
  const boostId = BigInt(searchParams.get('boostId') as string);
  const contractAddress = searchParams.get('contractAddress') as string;

  if (!userAddress || !gameId || !boostId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, boostId: ${boostId}`,
      {
        status: 400,
      }
    );
  }

  const boost = await prisma.boost_configuration.findFirst({
    where: {
      id: boostId,
      game_id: gameId,
      is_enabled: true
    },
    include: {
        claimed_boost: {
          where: {
            user_address: userAddress
          },
          select: {
            boost_id: true,
            updated_at: true
          }
        }
    }
  });

  if (!boost) {
    return new Response(`No available boost ${boostId} found for gameId: ${gameId}`, {
        status: 400,
      });
  }
  
  if (boost.boost_type === 'NFT' || boost.boost_type === 'NFT_PER_MINT' || boost.boost_type === 'TOKEN') {
    if (!contractAddress) {
        return new Response(
          `Missing parameters: userAddress: ${contractAddress}`,
          {
            status: 400,
          }
        );
      }
  }

  let verified = false;
  switch (boost.boost_type) {
    case 'NFT':
        verified = await ownsNFT(userAddress, contractAddress);
        break;
    case 'NFT_PER_MINT':
        verified = await ownsNFT(userAddress, contractAddress);
        break;
    case 'TOKEN':
        verified = await hasToken(userAddress, contractAddress);
        break;
    case 'RECURRING':
        const activeClaims = boost.claimed_boost.filter(c => {
            const refreshHours = boost.refresh_time ? boost.refresh_time.getHours() : 24;
            const expirationTime = new Date(c.updated_at.getTime() + refreshHours * 60 * 60 * 1000);
            return new Date() < expirationTime;
        });
        verified = activeClaims.length == 0;
        break;
  }

  if (verified) {
    const claimedBoost = await prisma.claimed_boost.create({
        data: {
          user_address: userAddress,
          boost_id: boost.id,
          game_id: gameId,
          contract_address: contractAddress ? contractAddress : null
        }
      });
      return NextResponse.json(claimedBoost);
  } else {
    return new Response(`Unable to claim boost for boostId: ${boostId}, gameId: ${gameId}`, {
        status: 400,
      });
  }
}