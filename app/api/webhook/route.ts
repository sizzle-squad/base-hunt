import { NextResponse, NextRequest } from 'next/server';

// type commandOp = {
//   command: string,
//   targetUrl: string,
//   userAddress: string
// }

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(JSON.stringify(body));
  return NextResponse.json({ status: 'ok' });
}
