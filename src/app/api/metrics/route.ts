import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { Network, Alchemy, OwnedNftsResponse } from "alchemy-sdk";
import { toBigInt } from '@/utils/toBigInt';

const settings = {
  apiKey: process.env.ALCHEMY_ID,
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
);

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret') as string;
    const gameId = toBigInt(searchParams.get('gameId') as string);

    // if (!secret || secret !== process.env.SHARED_SECRET) {
    //     return new Response('Unauthorized', { status: 401, });
    // }

    if (gameId === null) {
        return new Response(
            `Missing parameters: gameId: ${gameId}`,
            {
            status: 400,
            }
        );
    }

    const badgeData = await supabase
    .from('badge_configuration')
    .select('*')
    .eq('game_id', gameId)

    if (badgeData.error) {
    console.error(badgeData.error);
    throw new Error(badgeData.error.message);
    }

    const badges = badgeData.data;

    const mintersMap: Record<string, string[]> = {};

    badges.forEach(badge => {
        const minter = badge.minter;
        const contractAddress = badge.contract_address;

        if (!mintersMap[minter]) {
            mintersMap[minter] = [contractAddress];
        } else {
            if (!mintersMap[minter].includes(contractAddress)) {
                mintersMap[minter].push(contractAddress);
            }
        }
    });

    const responseMap: Record<string, OwnedNftsResponse> = {};
    for (const minter in mintersMap) {
        if (mintersMap.hasOwnProperty(minter)) {
            const contractAddresses = mintersMap[minter];
            const tokenBalanceRes = await alchemy.nft.getNftsForOwner(minter, { contractAddresses });
            responseMap[minter] = tokenBalanceRes;
        }
    }

    return NextResponse.json(responseMap);
  }