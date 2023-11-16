import { PrismaClient } from '@prisma/client';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { getTapRef } from '@/utils/iyk';

const prisma = new PrismaClient();

type RankType = {
  rank: number;
  user_address: string;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const iykRef = searchParams.get('iykRef');
  const result = await getTapRef(iykRef as string);
  console.log(result);
  return NextResponse.json(result);
}
