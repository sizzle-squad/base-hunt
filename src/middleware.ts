import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAfter, isBefore } from 'date-fns';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const startDate = new Date(process.env.START_DATE as string);
  const endDate = new Date(process.env.END_DATE as string);
  const now = new Date();
  const killSwitch = process.env.NEXT_PUBLIC_KILL_SWITCH === 'true';

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

https://twitter.com/intent/tweet?text=Check%20out%20this%20badge%3A%20Satellite%20Air%20Fair&url=https%3A%2F%2Ftariff-film-blank-badly.trycloudflare.com%2Fbadge%2F44