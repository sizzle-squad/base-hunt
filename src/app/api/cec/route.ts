import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { Database } from '@/utils/database.types';
import { airdropNft } from '@/utils/walletapi';

const ALLOW_LIST_ADDRESSES = [
    '0xEd981764D7fbe86F9f3bfA5b7841C12005A378DC',
    '0xD2990F9DCCe40958e7c57E4FdE58E89B7b2B3035',
    '0x67FF6d34F70aF2d2C0C49b834917c1cb67A5CA7a',
    '0xAbbf0cf375E6314bd606d391059410CBd8bC5A9A',
    '0xB1d1dE7bF93192737c5BF1ED6bb4cfbBdbE4B17a',
    '0x3E1B100EE96dB65bdd7Afb03b35DcD1C2F6088AA',
    '0x29891F95d64b7a30d8aB42256523d12051194f2b',
    '0x8668B2862556fEe9D4aF6d89A8810347E0326B1f',
    '0x4a738fF4dfEBF7Af169922Bb3b0d2e93f5E425a8'
].map(addr => addr.toLowerCase());

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

  const isAllowListAddress = address && ALLOW_LIST_ADDRESSES.includes(address.toLowerCase());

  const nonce = "__default_nonce__"

  if (!isAllowListAddress || !command) {
    return new Response(
      `Missing parameters: userAddress: ${address}, command: ${command}`,
      {
        status: 400,
      }
    );
  }
  try {
    await airdropNft(address, command, nonce);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ success: false });
  }
  return NextResponse.json({ success: true });
}
