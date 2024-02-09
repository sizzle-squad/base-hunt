import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';
import { verifyWebhookSecret } from '@/utils/webhook';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function POST(req: Request) {
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ status: 'unknown' });
  }

  const body = await req.json();
  //We only care about ERC1155 transfers
  if (body.event_type && body.event_type === 'EVENT_TYPE_TRANSFER_ERC1155') {
    body.value = (toBigInt(body.value) ?? BigInt(0)).toString();
    const levelData = await supabase
      .from('level_data')
      .upsert(body, { ignoreDuplicates: true })
      .select();

    if (levelData.error) {
      console.error(levelData);
      throw new Error(levelData.error.message);
    }
  }
  return NextResponse.json({ status: 'ok' });
}
