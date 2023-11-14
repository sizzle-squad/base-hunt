import { PrismaClient } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress');
  const gameId = searchParams.get('gameId');

  if (!userAddress || !gameId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  const rank =
    await prisma.$queryRaw`select row_number() over (order by total_hitpoints desc) as rank from treasure_box_entries where game_id = ${BigInt(
      gameId as string
    )}`;

  if (!rank) {
    return new Response(
      `No rank found with gameId: ${gameId}, address: ${userAddress}`,
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(rank);
}
