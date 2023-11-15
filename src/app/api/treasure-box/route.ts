import { TreasureBoxState } from '@/hooks/types';
import { verifyTreasureBoxRequest } from '@/utils/verifyTreasureBoxRequest';
import { PrismaClient } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';

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


export type TreasureBoxStateType = 
{
  id: bigint,
  created_at: Date,
  total_hitpoints: bigint,
  game_id: bigint,
  name: string,
  location: string,
  current_hitpoints: bigint | null,
  is_open: boolean | null
}


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameId = searchParams.get('gameId');

  if (!gameId) {
    return new Response('Missing parameters: gameId', { status: 400 });
  }

  const treasureBox:TreasureBoxStateType[] = await prisma.$queryRaw`select tb.id,tb.created_at,tb.total_hitpoints,tb.game_id,tb.name,tb.location,tbs.current_hitpoints,tbs.is_open from treasure_box_configuration as tb LEFT JOIN treasure_box_state as tbs on tb.game_id = tbs.game_id where tb.game_id = ${BigInt(gameId)}`
 
  if (!treasureBox || treasureBox.length === 0) {
    return new Response(`Treasure box not found with gameId: ${gameId}`, {
      status: 400,
    });
  }
  const tb = await mapTreasureBoxState(treasureBox[0]);
  console.log(tb);
  return NextResponse.json(tb);
}

async function mapTreasureBoxState(treasureBox:TreasureBoxStateType): Promise<TreasureBoxState> {
  return {
    id: treasureBox.id as bigint,
    createdAt: treasureBox.created_at,
    gameId: treasureBox.game_id,
    name: treasureBox.name,
    location: treasureBox.location,
    totalHitpoints: treasureBox.total_hitpoints,
    currentHitpoints: treasureBox.current_hitpoints as bigint,
    isOpen: treasureBox.is_open === true,
  };
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
        user_address_game_id: {
          user_address: user.address,
          game_id: gameIdInBigInt  
        }
      },
      create: {
        game_id: gameIdInBigInt,
        user_address: user.address,
        cbid: user.cbId,
        ens_name: user.ensName,
        total_hitpoints: score.current_score,
        tap_count:1,
      },
      update: {
        total_hitpoints: {
          increment: score.current_score,
        },
        tap_count:{
          increment: 1,
        }
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error: failed to register treasure box entry', {
      status: 400,
    });
  }

  return NextResponse.json({ status: 'ok' });
}
