import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { Database } from '@/utils/database.types';
import { OptInPostBodyType } from '@/hooks/useMutateOptIn';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

// Opt in to the game
export async function POST(request: NextRequest) {
  const body: OptInPostBodyType = await request.json();
  const { gameId, userAddress } = body;

  if (!userAddress || !gameId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}`,
      {
        status: 400,
      }
    );
  }

  const params = {
    user_address: userAddress.toLowerCase(),
    game_id: parseInt(gameId),
  };

  const userOptInData = await supabase
    .from('user_address_opt_in')
    .select()
    .eq('game_id', params.game_id)
    .eq('user_address', params.user_address)
    .maybeSingle();

  if (userOptInData.error) {
    console.error(userOptInData.error);
    return new Response(`Error getting user opt in data`, {
      status: 400,
    });
  }

  if (!userOptInData.data) {
    const { error } = await supabase
      .from('user_address_opt_in')
      .insert(params)
      .select();

    if (error) {
      console.error(error);
      return new Response(`Error: failed to register address: ${userAddress}`, {
        status: 400,
      });
    }
  }

  return NextResponse.json({ success: true });
}
