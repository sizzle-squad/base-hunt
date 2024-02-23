import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import {
  CheckFunctions,
  MapChallengeTypeUserAddress,
} from '@/utils/claims/selectors';
import {
  ChallengeStatus,
  ChallengeType,
  Networks,
} from '@/utils/database.enums';
import { Database } from '@/utils/database.types';
import { providers } from '@/utils/ethereum';
import { verifyWebhookSecret, WebhookData } from '@/utils/webhook';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function POST(req: Request) {
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ status: 'unknown' });
  }
  const data = (await req.json()) as WebhookData;
  const challenges = await supabase
    .from('challenge_configuration')
    .select()
    .is('auto_claim', true)
    .is('is_enabled', true)
    .like('contract_address', data.contract_address);
  if (challenges.error) {
    console.error(challenges);
    return NextResponse.json({ status: 'ok' });
  }

  if (challenges.data.length === 0) {
    return NextResponse.json({ status: 'ok' });
  }

  for (let i = 0; i < challenges.data.length; i++) {
    try {
      const c = challenges.data[i];
      let eventType =
        ChallengeType[data.event_type as keyof typeof ChallengeType];

      if (c.type !== eventType) {
        console.error(
          'skipping challenge:',
          c.id,
          'type:',
          c.type,
          'event_type:',
          data.event_type
        );
        continue;
      }

      if (c.is_dynamic_points) {
        console.warn(
          `dynamic points not supported for streaming challenges:` + c.id
        );
        continue;
      }

      let checkFunc =
        CheckFunctions[c.function_type as keyof typeof CheckFunctions];
      if (checkFunc === undefined) {
        throw new Error(
          'check function is undefined:' +
            c.function_type +
            ' challenge id:' +
            c.id
        );
      }

      const network = c.network as Networks;
      const provider = providers[network];

      if (provider === undefined) {
        throw new Error('provider is undefined for network:' + c.network);
      }

      let challengeType = ChallengeType[c.type as keyof typeof ChallengeType];
      if (challengeType === undefined) {
        throw new Error(`challenge type is undefined:` + c.type);
      }
      if (await checkFunc({ ...data, ...(c.params as object) }, provider)) {
        let userAddress = await MapChallengeTypeUserAddress[
          c.function_type as keyof typeof CheckFunctions
        ]({ ...data, ...(c.params as object), provider: provider });
        if (userAddress === undefined) {
          throw new Error('user address is undefined');
        }

        //Check user Opt-in
        const userOptInData = await supabase
          .from('user_address_opt_in')
          .select('is_opt_in')
          .eq('user_address', userAddress)
          .eq('game_id', c.game_id as number)
          .maybeSingle();
        if (userOptInData.error) {
          throw userOptInData.error;
        }

        if (!userOptInData.data || userOptInData.data.is_opt_in === false) {
          console.warn('user not opted in:', userAddress, c.game_id, c.id);
          return NextResponse.json({ status: 'ok' });
        }

        const claim = await supabase
          .from('user_challenge_status')
          .insert({
            user_address: userAddress,
            challenge_id: c.id,
            status: ChallengeStatus.COMPLETE,
            points: c.points as number,
            game_id: c.game_id as number,
          })
          .select();
        if (claim.error) {
          throw claim.error;
        }
      }
    } catch (error) {
      console.error(
        'processing challenge:',
        challenges.data[i].id,
        'error:',
        error
      );
    }
  }
  return NextResponse.json({ status: 'ok' });
}
