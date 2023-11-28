import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function POST(req: Request) {
  const body = await req.json();
  console.log('[webhook transfer] body:', body);
  const webhookData = await supabase
    .from('webhook_data')
    .upsert(body, { ignoreDuplicates: true })
    .select();
  if (webhookData.error) {
    console.error(webhookData);
    throw new Error(webhookData.error.message);
  }
  return NextResponse.json({ status: 'ok' });
}
