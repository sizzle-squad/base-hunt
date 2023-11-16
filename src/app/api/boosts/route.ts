import { PrismaClient } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress') as string;
  const gameId = BigInt(searchParams.get('gameId') as string);

  if (!userAddress || !gameId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  const boosts = await prisma.boost_configuration.findMany({
    where: {
      game_id: gameId
    },
    include: {
      claimed_boost: {
        where: {
          user_address: userAddress
        },
        select: {
          boost_id: true
        }
      }
    }
  });

  const boostsFormatted = boosts.map(boost => {
    const isClaimed = boost.claimed_boost.some(claimed => claimed.boost_id === boost.id);
    return { ...boost, claimed: isClaimed };
  });

  if (!boostsFormatted) {
    return new Response(`No available boosts found for gameId: ${gameId}`, {
      status: 400,
    });
  }

  return NextResponse.json(boostsFormatted);
}