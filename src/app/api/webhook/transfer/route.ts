import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  console.log('[webhook transfer] body:', body);
  const webhook_data = await prisma.webhook_data.create({
    data: {
      ...body,
    },
  });
  return NextResponse.json({ status: 'ok' });
}
