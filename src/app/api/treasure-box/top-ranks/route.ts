import { PrismaClient } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';

const prisma = new PrismaClient();

// return top 10 ranks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = searchParams.get('gameId');

  if (!gameId) {
    return new Response(`Missing parameters: gameId: ${gameId}`, {
      status: 400,
    });
  }

  const topTenRanks = await prisma.treasure_box_entries.findMany({
    where: {
      game_id: BigInt(gameId as string),
    },
    orderBy: {
      total_hitpoints: 'desc',
    },
    take: 10,
  });

  if (!topTenRanks) {
    return new Response(`No top ranks found with gameId: ${gameId}`, {
      status: 400,
    });
  }

  return NextResponse.json(topTenRanks);
}
