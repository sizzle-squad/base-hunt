import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';
import { airdropNft } from '@/utils/walletapi';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export type MintData = {
  userAddress: `0x${string}` | undefined;
  command: string;
};

export async function POST(request: NextRequest) {
  const body: MintData = await request.json();
  const { userAddress, command } = body;

  if (!userAddress || !command) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, command: ${command}`,
      {
        status: 400,
      }
    );
  }
  try {
    await airdropNft(userAddress, command);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false });
  }
  return NextResponse.json({ success: true });
}