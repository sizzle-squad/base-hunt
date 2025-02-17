import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

import { Database } from '@/utils/database.types';
import { toBigInt } from '@/utils/toBigInt';
import { airdropNft } from '@/utils/walletapi';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

export type MintData = {
  address: `0x${string}` | undefined;
  command: string;
};

export async function POST(request: NextRequest) {
  const body: MintData = await request.json();
  const { address, command } = body;

  // TODO: remove this soon
  const nonce =
    command === 'wallet-summit-q3'
      ? ethers.hexlify(ethers.randomBytes(32))
      : undefined;

  if (!address || !command) {
    return new Response(
      `Missing parameters: userAddress: ${address}, command: ${command}`,
      {
        status: 400,
      }
    );
  }
  try {
    await airdropNft(address, command), nonce;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false });
  }
  return NextResponse.json({ success: true });
}
