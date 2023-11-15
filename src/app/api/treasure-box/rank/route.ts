import { PrismaClient } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';

const prisma = new PrismaClient();

type RankType = {
  rank: number;
  user_address: string;
};

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

  const rank: RankType[] =
    await prisma.$queryRaw`select temp.* from (select row_number() over (order by total_hitpoints desc) as rank, 
    user_address as user_address from treasure_box_entries where game_id = ${BigInt(
      gameId as string
    )} ) as temp where user_address ILIKE ${userAddress}`;
  if (!rank) {
    return new Response(
      `No rank found with gameId: ${gameId}, address: ${userAddress}`,
      {
        status: 400,
      }
    );
  }

  const playerRank = rank[0];
  return NextResponse.json({
    rank: playerRank?.rank.toString(),
    userAddress: playerRank?.user_address,
  });
}
