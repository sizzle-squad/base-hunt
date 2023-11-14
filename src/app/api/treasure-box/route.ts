import { verifyTreasureBoxRequest } from '@/utils/verifyTreasureBoxRequest';
import { PrismaClient } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';

const prisma = new PrismaClient();

export type UserPublicProfileType = {
  address: `0x${string}`;
  cbId?: string;
  ensName?: string;
};

export type TreasureBoxType = {
  gameId: string;
  user: UserPublicProfileType;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = searchParams.get('gameId');

  if (!gameId) {
    return new Response('Missing parameters: gameId', { status: 400 });
  }

  const treasureBox = await prisma.treasure_box.findFirst({
    where: {
      game_id: BigInt(gameId as string),
    },
  });

  if (!treasureBox) {
    return new Response(`Treasure box not found with gameId: ${gameId}`, {
      status: 400,
    });
  }

  return NextResponse.json({
    hitPoints: treasureBox.hit_points,
    isOpen: treasureBox.is_open,
    location: treasureBox.location,
  });
}

export async function POST(request: NextRequest) {
  const body: TreasureBoxType = await request.json();

  verifyTreasureBoxRequest(body);

  const { gameId, user } = body;

  const gameIdInBigInt = BigInt(gameId as string);

  const score = await prisma.score.findFirst({
    where: {
      user_address: {
        equals: user.address,
        mode: 'insensitive',
      },
      game_id: gameIdInBigInt,
    },
  });

  if (!score) {
    return new Response('Error: score not found', { status: 400 });
  }

  // const pointInBigInt = BigInt(points as string);

  try {
    await prisma.treasure_box_entries.upsert({
      where: {
        user_address: user.address,
        game_id: gameIdInBigInt,
      },
      create: {
        game_id: gameIdInBigInt,
        user_address: user.address,
        cbid: user.cbId,
        ens_name: user.ensName,
        total_hitpoints: score.current_score,
      },
      update: {
        total_hitpoints: {
          increment: score.current_score,
        },
      },
    });
  } catch (error) {
    return new Response('Error: failed to register treasure box entry', {
      status: 400,
    });
  }

  return NextResponse.json({ status: 'ok' });
}
