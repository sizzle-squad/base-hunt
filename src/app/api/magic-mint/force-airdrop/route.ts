import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

import { airdropNft } from '@/utils/walletapi';
const ALLOWED_ORGINS = process.env.ALLOWED_ORGINS?.split(',') ?? [];

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

  const origin = req.headers.get('origin');

  if (!origin || !ALLOWED_ORGINS.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
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

  const res = NextResponse.json({ status: 'ok' });
  res.headers.set('Access-Control-Allow-Origin', origin); // CORS credentials mode is 'include'

  return res;
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

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!origin || !ALLOWED_ORGINS.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, x-cb-device-id, x-cb-project-name, x-cb-user-id, x-cb-pagekey, x-cb-is-logged-in, x-cb-platform,  x-cb-project-name, x-cb-session-uuid, x-cb-ujs, x-cb-version-name, x-force-airdrop-secret',
    },
  });
}
