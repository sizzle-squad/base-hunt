import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { WebhookData, verifyWebhookSecret } from '@/utils/webhook';
import { Database } from '@/utils/database.types';
import {
  Networks,
  ChallengeStatus,
  ChallengeType,
} from '@/utils/database.enums';
import { CheckFunctions } from '@/utils/claims/selectors';

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
      let check = false;
      let userAddress = '';
      const network =
        Networks[c.network as keyof typeof Networks] ||
        Networks.networks_base_mainnet;
      switch (c.type) {
        case ChallengeType.EVENT_TYPE_CONTRACT_EXECUTION:
          check = await CheckFunctions[
            c.function_type as keyof typeof CheckFunctions
          ](data, c.params, network);
          userAddress = data.from_address;
          break;
        case ChallengeType.EVENT_TYPE_TRANSFER_ERC1155:
        case ChallengeType.EVENT_TYPE_TRANSFER_ERC721:
          check = await CheckFunctions[
            c.function_type as keyof typeof CheckFunctions
          ](data, c.params, network);
          userAddress = data.to_address;
          break;
        default:
          console.warn('unknown streaming challenge type:', c);
      }
      if (check) {
        //Insert the claim
        const claim = await supabase
          .from('user_challenge_status')
          .insert({
            user_address: userAddress,
            challenge_id: c.id,
            status: ChallengeStatus.COMPLETE,
          })
          .select();
        if (claim.error) {
          throw claim.error;
        }
      }
    } catch (error) {
      console.error(
        'processing challenge:',
        challenges.data[i],
        'error:',
        error
      );
    }
  }
  return NextResponse.json({ status: 'ok' });
}

/*

database triggers:

CREATE OR REPLACE FUNCTION webhook_data_update() RETURNS TRIGGER AS $$ 
    DECLARE 
      _num_nfts BIGINT;
    BEGIN 
        PERFORM 1 from badge_configuration as b WHERE b.contract_address = NEW.contract_address and b.token_id::bigint = ('x'||lpad(trim( leading '0' from substring(NEW.value,3)),16,'0'))::bit(64)::bigint and b.minter = NEW.from_address
        and b.game_id = 0 and b.type != 'level';
        IF FOUND THEN
          SELECT count(*)+1 into _num_nfts from webhook_data where to_address = NEW.to_address;
          INSERT into claimed_boost(boost_id,user_address,game_id)
          SELECT b.id as boost_id,NEW.to_address as user_address,0 as game_id
          FROM boost_configuration AS b
          LEFT JOIN claimed_boost AS c ON b.id = c.boost_id AND c.user_address = NEW.to_address
          WHERE b.boost_type = 'TRANSFER_NFT' 
          and b.game_id = 0
          AND c.boost_id IS NULL
          AND b.nft_amount <= _num_nfts 
          ON CONFLICT (boost_id,user_address,game_id)
          DO NOTHING;               
          RETURN NEW;
        END IF;
        RETURN NULL;
    END; 
    $$ LANGUAGE 'plpgsql'; 

CREATE TRIGGER webhook_data_update_trigger
BEFORE INSERT ON webhook_data
FOR EACH ROW EXECUTE PROCEDURE webhook_data_update();


CREATE OR REPLACE FUNCTION claimed_boost_insert() RETURNS TRIGGER AS $$ 
    DECLARE 
    _points bigint;      
    BEGIN 
        SELECT points into _points from boost_configuration where id = NEW.boost_id;
        UPDATE score SET current_score = score.current_score + _points  WHERE user_address = NEW.user_address and game_id = NEW.game_id; 
        IF NOT FOUND THEN 
        INSERT INTO score(current_score,user_address,game_id) values (_points, NEW.user_address, NEW.game_id); 
        END IF; 
        RETURN NULL;
    END; 
    $$ LANGUAGE 'plpgsql'; 

CREATE TRIGGER claimed_boost_insert_trigger
AFTER INSERT ON claimed_boost
FOR EACH ROW EXECUTE PROCEDURE claimed_boost_insert()

*/
