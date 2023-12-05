import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAfter, isBefore } from 'date-fns';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const startDate = new Date(process.env.START_DATE as string);
  const endDate = new Date(process.env.END_DATE as string);
  const now = new Date();
  const killSwitch = Boolean(process.env.KILL_SWITCH);

  if (killSwitch || isBefore(now, startDate) || isAfter(now, endDate)) {
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
    '/art-reveal-screen/:path*',
  ],
};
