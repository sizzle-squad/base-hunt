import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';
import { airdropNft } from '@/utils/walletapi';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export type MintData = {
  address: `0x${string}` | undefined;
  command: string;
};

export async function POST(request: NextRequest) {
  const body: MintData = await request.json();
  const { address, command } = body;

  if (!address || !command) {
    return new Response(
      `Missing parameters: userAddress: ${address}, command: ${command}`,
      {
        status: 400,
      }
    );
  }
  try {
    //TODO: the airdrop command should include gameId in the future
    const userData = await supabase
      .from('user_address_opt_in')
      .select()
      .eq('user_address', address.toLowerCase())
      .single();
    if (userData.error) {
      console.error(`user not opted in:`, userData.error);
      return NextResponse.json({ success: false });
    }
    await airdropNft(address, command);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false });
  }
  return NextResponse.json({ success: true });
}
