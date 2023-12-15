import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAfter, isBefore } from 'date-fns';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const startDate = new Date(process.env.START_DATE as string);
  const endDate = new Date(process.env.END_DATE as string);
  const now = new Date();
  const killSwitch = process.env.NEXT_PUBLIC_KILL_SWITCH === 'true';
  const password = request.nextUrl.searchParams.get(
    process.env.SEARCH_QUERY_NAME!
  );
  const hasCookie = request.cookies.has(process.env.PASSWORD_COOKIE_NAME!);
  const url = request.nextUrl.clone();

  const response = NextResponse.redirect(url);

  if (hasCookie) {
    return;
  } else if (password === process.env.PAGE_PASSWORD && !hasCookie) {
    // pw bypass
    response.cookies.set(`${process.env.PASSWORD_COOKIE_NAME}`, 'true', {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
    });
    return response;
  } else if (killSwitch || isBefore(now, startDate) || isAfter(now, endDate)) {
    return NextResponse.redirect(new URL('/thanks', request.url));
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
    '/api/:path*',
    '/',
  ],
};
