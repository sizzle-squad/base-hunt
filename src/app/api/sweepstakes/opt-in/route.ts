import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = process.env.ALLOWED_ORGINS?.split(',') ?? [];

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

type SweepstakesRequest = {
  gameId: string;
  userAddress: string;
};

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
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
  try {
    const { gameId, userAddress }: SweepstakesRequest = await request.json();

    if (!userAddress || !gameId) {
      return new Response(
        `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
        { status: 400 }
      );
    }
    console.log('POST /api/sweepstakes/opt-in', { userAddress, gameId });
    
    // Check if the user is already opted in
    const { data: isOptedIn, error: optInError } = await supabase.rpc('get_is_opt_in_sweepstakes', {
      _game_id: gameId,
      _user_address: userAddress.toLowerCase(),
    });

    if (optInError) {
      console.error(optInError);
      throw new Error(optInError.message);
    }

    if (isOptedIn == null) {
      console.error('User not found');
      return new Response('User not found', { status: 404 });
    }

    if (isOptedIn) {
      console.error('User is already opted in');
      return new Response('User is already opted in', { status: 400 });
    }

    // Opt the user in
    const { error: optInStatusError } = await supabase.rpc('opt_in_sweepstakes', {
      _game_id: gameId,
      _user_address: userAddress.toLowerCase(),
    });

    if (optInStatusError) {
      throw new Error(optInStatusError.message);
    }

    return new Response('Successfully opted in', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
