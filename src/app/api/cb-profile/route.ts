import axios from 'axios';
import { type NextRequest } from 'next/server';

import { UserPublicProfile } from '@/hooks/types';
import { WALLET_API_URL } from '@/utils/env';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress');

  if (!userAddress) {
    return new Response('Missing parameters: userAddress', { status: 400 });
  }

  const result = await axios({
    method: 'GET',
    url: `${WALLET_API_URL}/getPublicProfileByAddress`,
    params: {
      queryAddress: userAddress,
    },
  });

  const userPublicProfile: UserPublicProfile = result.data.result;

  return new Response(JSON.stringify(userPublicProfile), {
    headers: { 'content-type': 'application/json' },
  });
}
