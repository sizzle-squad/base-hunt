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
  const { gameId, userAddress, referralId } = body;

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

  const optInAndReferralData = await supabase.rpc(
    'opt_in_and_track_referrals',
    {
      _game_id: params.game_id,
      _user_address: params.user_address,
      _referral_id: referralId ?? '',
    }
  );

  return optInAndReferralData.status === 200
    ? NextResponse.json({ success: true })
    : NextResponse.json({ success: false });
}
