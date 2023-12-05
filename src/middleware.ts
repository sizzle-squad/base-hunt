import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const startDate = new Date('2021-09-01T00:00:00.000Z');
  const endDate = new Date('2022-09-30T23:59:59.999Z');
  const now = new Date();
  const killSwitch = process.env.KILL_SWITCH ?? false;

  if (now < startDate || now > endDate || killSwitch) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/art-reveal/:path*',
    '/badges/:path*',
    '/boosts/:path*',
    '/leaderboard/:path*',
    '/levels/:path*',
    '/locations/:path*',
  ],
};
