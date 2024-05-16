import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';

import { createClient } from '@supabase/supabase-js';

import {
  SpinData,
  SpinOption,
  SpinTheWheelState,
} from '../../../../hooks/types';
import {
  currentTimeUTC,
  getAllSpins,
  getEnabledSpins,
  getRandomOutcome,
  getUserSpinData,
  UserSpinType,
} from '../spinHelper';

const ALLOWED_ORGINS = process.env.ALLOWED_ORGINS?.split(',') ?? [];

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

type SpinTheWheelExecuteRequest = {
  gameId: string;
  userAddress: string;
};

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORGINS.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  const body: SpinTheWheelExecuteRequest = await request.json();

  const { gameId, userAddress } = body;
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
    const userHasAvailableSpin = spinData.hasAvailableSpin;

    if (!userHasAvailableSpin) {
      return new Response(
        `No available spin for userAddress: ${userAddress}, gameId: ${gameId}`,
        {
          status: 400,
        }
      );
    }

    const generatedSpin = getRandomOutcome(currentlyEnabledSpins);
    const saveSpin = await supabase.rpc('update_spin_and_points', {
      _game_id: gameId,
      _user_address: userAddress.toLowerCase(),
      _last_spin_id: generatedSpin.id,
      _total_spins: spinData.totalSpins,
      _points_increment: generatedSpin.points,
      _last_spin_at: currentTimeUTC(),
    });

    if (saveSpin.error) {
      console.error(saveSpin.error);
      throw new Error(saveSpin.error.message);
    }

    if (!saveSpin.data) {
      console.error(
        `Unable to save spin for userAddress: ${userAddress}, gameId: ${gameId}`
      );
      return new Response(
        `Unable to save spin for userAddress: ${userAddress}, gameId: ${gameId}`,
        {
          status: 400,
        }
      );
    }

    let userSpin = saveSpin.data as UserSpinType;
    const updatedSpin: SpinData = {
      id: userSpin.id.toString(),
      gameId: userSpin.game_id.toString(),
      userAddress: userSpin.user_address,
      hasAvailableSpin: false,
      lastSpinResult: generatedSpin,
      totalSpins: userSpin.total_spins,
    };

    return NextResponse.json(
      mapToSpinTheWheelState(updatedSpin, currentlyEnabledSpins)
    );
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
