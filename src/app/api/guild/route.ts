import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { ethers } from 'ethers';
import { GuildPostBodyData } from '@/hooks/useMutateGuild';
import { Database } from '@/utils/database.types';
import { ChallengeType, CheckFunctionType } from '@/utils/database.enums';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

// Register a user to a guild
export async function POST(request: NextRequest) {
  const body: GuildPostBodyData = await request.json();
  const { gameId, userAddress, guildId, signature, secret } = body;

  if (signature === undefined && secret === undefined) {
    return new Response(`Missing authorization`, {
      status: 405,
    });
  }

  if (!userAddress || !gameId || !guildId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, guildId: ${guildId}`,
      {
        status: 400,
      }
    );
  }

  const params = {
    user_address: userAddress.toLowerCase(),
    game_id: parseInt(gameId),
    guild_id: guildId,
  };

  //claim the join guild challenge
  const challengeData = await supabase
    .from('challenge_configuration')
    .select('id,points')
    .eq('game_id', gameId)
    .eq('type', ChallengeType.SOCIAL)
    .eq('function_type', CheckFunctionType.checkJoinGuild)
    .single();
  if (challengeData.error) {
    console.error(challengeData.error);
    return new NextResponse(`Error getting challenge data`, {
      status: 400,
    });
  }

  const guildData = await supabase
    .from('guild_configuration')
    .select()
    .eq('guild_id', params.guild_id)
    .eq('game_id', params.game_id)
    .single();

  if (guildData.error) {
    return new NextResponse(`Error getting guild data`, {
      status: 404,
    });
  }

  const joinMessageTemplate = `Joining ${guildData.data.name}:${params.guild_id} with wallet:${params.user_address} for base-hunt:${params.game_id} for eth-denver`;

  const recoveredAddress = ethers.verifyMessage(
    joinMessageTemplate,
    signature as string
  );
  if (
    secret !== process.env.WEBHOOK_SECRET ||
    recoveredAddress.toLowerCase() !== params.user_address
  ) {
    return new Response(`Unauthorized`, {
      status: 405,
    });
  }

  const { error } = await supabase
    .from('guild_member_configuration')
    .insert(params)
    .select();

  if (error) {
    console.error(error);

    return new Response(`Error: failed to join guild: ${guildId}`, {
      status: 400,
    });
  }

  const claimChallengeData = await supabase
    .from('user_challenge_status')
    .upsert(
      {
        user_address: params.user_address,
        challenge_id: challengeData.data.id,
        status: 'COMPLETE',
        points: challengeData.data.points,
        game_id: params.game_id,
      },
      {
        onConflict: 'game_id,user_address,challenge_id',
        ignoreDuplicates: true,
      }
    );

  if (claimChallengeData.error) {
    console.error(claimChallengeData.error);
    return new NextResponse(`Error claiming join challegne`, {
      status: 400,
    });
  }

  if (body.referrerAddress) {
    console.log(
      'applying referrer bonuse to:',
      body.referrerAddress.toLowerCase()
    );
    const referrerData = await supabase.rpc('incrementuserscore', {
      _game_id: params.game_id,
      _user_address: body.referrerAddress.toLowerCase(),
      _score: challengeData.data.points * 0.1,
    });
    if (referrerData.error) {
      console.error(`error incrementing referrerScore:${referrerData.error}`);
    }
  }

  return NextResponse.json({ success: true });
}
