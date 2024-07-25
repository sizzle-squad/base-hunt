import { NextRequest, NextResponse } from 'next/server';

export async function authenticate(
  req: NextRequest,
  next: () => Promise<NextResponse>
) {
  const apiKey = req.headers.get('x-api-key');
  console.warn(
    `Onboarding Leaderboard API Key: ${process.env.BH_PRIVATE_ENDPOINTS_API_KEY}, apiKey: ${apiKey}`
  );

  if (!apiKey || apiKey !== process.env.BH_PRIVATE_ENDPOINTS_API_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  return next();
}
