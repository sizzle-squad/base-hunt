import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSecret } from '@/utils/webhook';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function POST(req: Request) {
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ status: 'unknown' });
  }

  const body = await req.json();
  console.log('[level transfer] body:', body);
  const levelData = await supabase
    .from('level_data')
    .upsert(body, { ignoreDuplicates: true })
    .select();
  if (levelData.error) {
    console.error(levelData);
    throw new Error(levelData.error.message);
  }
  return NextResponse.json({ status: 'ok' });
}
