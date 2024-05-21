import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { createClient } from '@supabase/supabase-js';

import { toBigInt } from '@/utils/toBigInt';

import {
  calculateTimeUntilResetTime,
  getAllSpins,
  getEnabledSpins,
  getUserSpinData,
} from './spinHelper';
import { SpinData, SpinOption, SpinTheWheelState } from '../../../hooks/types';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
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

  try {
    const spinDataRes = await supabase.rpc('getspindata', {
      _game_id: gameId,
      _user_address: userAddress.toLowerCase(),
    });

    if (spinDataRes.error) {
      console.error(spinDataRes.error);
      throw new Error(spinDataRes.error.message);
    }

    let spinOptions = getAllSpins(spinDataRes.data['spinOptions']);
    let spinData = getUserSpinData(spinDataRes.data['spinData'], spinOptions);
    let currentlyEnabledSpins = getEnabledSpins(
      spinDataRes.data['spinOptions']
    );

    const response = NextResponse.json(
      mapToSpinTheWheelState(spinData, currentlyEnabledSpins)
    );

    // if user has no spins left, and there is more than one hour left in the UTC day, cache for 1 hour
    if (!spinData.hasAvailableSpin && shouldCache()) {
      response.headers.set('Cache-Control', 'public, s-maxage=3600');
      response.headers.set('CDN-Cache-Control', 'public, s-maxage=3600');
      response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=3600');
    }

    return response;
  } catch (e) {
    console.error(e);
    NextResponse.error();
  }
}

function mapToSpinTheWheelState(
  spinData: SpinData,
  spinOptions: SpinOption[]
): SpinTheWheelState {
  return {
    spinOptions: spinOptions,
    spinData: spinData,
  };
}

function shouldCache() {
  const timeUntilMidnightMs = calculateTimeUntilResetTime();
  // if more than 1 hour remaining, cache for 1 hour
  const oneHourMs = 3600000;
  if (timeUntilMidnightMs > oneHourMs) {
    return true;
  }
  return false;
}
