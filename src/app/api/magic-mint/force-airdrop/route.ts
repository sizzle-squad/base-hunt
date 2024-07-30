import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

import { airdropNft } from '@/utils/walletapi';
import { verifyWebhookSecret } from '@/utils/webhook';

const commandLog = '[magic mint - force airdrop]';

/*
curl -X POST 'http://localhost:3000/api/magic-mint/force-airdrop' -d '{
    "userAddres": "0x...",
    "command": "level1",
    "forced": true
    }
}'  -H 'Content-Type: application/json'
*/

// this endpoints allows us to force airdrop a level NFT
export async function POST(req: Request) {
  if (!verifyForceAirdropSecret(req)) {
    return NextResponse.json({ status: 'unknown' });
  }

  console.log(commandLog);
  const { userAddress, command, forced } = await req.json();

  const nonce = forced ? ethers.hexlify(ethers.randomBytes(32)) : undefined;

  try {
    await airdropNft(userAddress, command, nonce);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 'error',
      message: `failed to airdrop ${command} NFT`,
    });
  }

  return NextResponse.json({ status: 'ok' });
}

function verifyForceAirdropSecret(req: Request): boolean {
  const secret = process.env.FORCE_AIRDROP_SECRET;
  const headerSecret = req.headers.get('x-force-airdrop-secret');
  if (!secret) {
    console.warn('FORCE_AIRDROP_SECRET not set');
    return false;
  }

  if (!headerSecret) {
    return false;
  }
  return secret?.toLowerCase() === headerSecret?.toLowerCase();
}
