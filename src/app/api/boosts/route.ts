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
          contract_address: true,
          updated_at: true
        }
      }
    }
  });

  const boostsFormatted = boosts.map(boost => {
    let isClaimed = false;
    const claimedAddresses = boost.claimed_boost.filter(b => b.contract_address).map(b => b.contract_address);
    switch (boost.boost_type) {
        case 'NFT':
            isClaimed = boost.contract_addresses.every(a => claimedAddresses.includes(a));
            break;
        case 'NFT_PER_MINT':
            isClaimed = boost.contract_addresses.every(a => claimedAddresses.includes(a));
            break;
        case 'TOKEN':
            isClaimed = boost.claimed_boost.every(c => c.boost_id === boost.id);
            break;
        case 'RECURRING':
            const activeClaims = boost.claimed_boost.filter(c => {
                const refreshHours = boost.refresh_time ? boost.refresh_time.getHours() : 24;
                const expirationTime = new Date(c.updated_at.getTime() + refreshHours * 60 * 60 * 1000);
                return new Date() < expirationTime;
            });
            isClaimed = activeClaims.length > 0;
            break;
    }
    isClaimed = isClaimed && boost.claimed_boost.length > 0;
    return { ...boost, claimed: isClaimed };
  });

  if (!boostsFormatted) {
    return new Response(`No available boosts found for gameId: ${gameId}`, {
      status: 400,
    });
  }

  return NextResponse.json(boostsFormatted);
}