import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { toBigInt } from '@/utils/toBigInt';
import { convertPSTtoUTC } from '../spin-the-wheel/spinHelper';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

type ActivityType = {
  type: string;
  userAddress: string;
  data?: any;
  createdAt: string;
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const gameId = toBigInt(searchParams.get('gameId') as string);

  if (!gameId) {
    return new Response(`Missing parameter: gameId: ${gameId}`, {
      status: 400,
    });
  }

  try {
    const [challenges, spins, badges, referrals, wheelConfiguration] =
      await Promise.all([
        // fetch recent challenges
        supabase
          .from('user_challenge_status')
          .select()
          .eq('game_id', gameId)
          .order('created_at', { ascending: false })
          .limit(10),
        // fetch recent spins
        supabase
          .from('user_spins')
          .select()
          .eq('game_id', gameId)
          .order('created_at', { ascending: false })
          .limit(10),
        // fetch recent badges
        supabase
          .from('user_badges')
          .select()
          .eq('game_id', gameId)
          .order('created_at', { ascending: false })
          .limit(10),
        // fetch recent referrals
        supabase
          .from('user_referrals')
          .select()
          .eq('game_id', gameId)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase.from('wheel_configuration').select().eq('enabled', true),
      ]);

    if (challenges.error) throw challenges.error;
    if (spins.error) throw spins.error;
    if (badges.error) throw badges.error;
    if (referrals.error) throw referrals.error;
    if (wheelConfiguration.error) throw wheelConfiguration.error;

    let wheelConfigurationMap = new Map();
    wheelConfiguration.data.forEach((wheelItem) => {
      wheelConfigurationMap.set(wheelItem.id, wheelItem);
    });

    // Combine and sort all activities
    const activities: ActivityType[] = [
      ...challenges.data.map((item: any) => ({
        type: 'challenge',
        userAddress: item.user_address,
        createdAt: item.created_at,
      })),
      ...spins.data.map((item: any) => ({
        type: 'spin',
        userAddress: item.user_address,
        createdAt: convertPSTtoUTC(item.created_at),
      })),
      ...badges.data.map((item: any) => ({
        type: 'badge',
        userAddress: item.user_address,
        data: {
          badgeId: item.badge_id,
        },
        createdAt: item.created_at,
      })),
      ...referrals.data.map((item: any) => ({
        type: 'referral',
        userAddress: item.user_address,
        createdAt: item.created_at,
      })),
    ];

    activities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const response = NextResponse.json(activities);
    // cache for 20 seconds
    response.headers.set('Cache-Control', 'public, s-maxage=20');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=20');
    response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=20');
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}
