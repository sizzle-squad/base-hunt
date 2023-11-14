import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import '@/utils/helper';
import { Badge, ChallengeTypeEnum } from '../../../../hooks/types';

const prisma = new PrismaClient();

type QueryData = {
  id: bigint;
  name: string;
  image_url: string;
  to_address: string;
  type: ChallengeTypeEnum;
  transaction_hash: string;
  created_at: Date;
  contract_address: string;
  token_id: bigint;
  cta_text: string;
  cta_url: string;
};
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userAddress = searchParams.get('userAddress') as string;
  const gameId = BigInt(searchParams.get('gameId') as string);

  //queryRaw is safe: https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw
  const data: QueryData[] =
    await prisma.$queryRaw`select  b.id,b.name,b.image_url,b.contract_address,b.token_id,b.cta_url,b.cta_text,b.type,w.to_address,w.transaction_hash,w.created_at,w.event_type from badge_configuration as b LEFT join webhook_data as w
     on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = substring(w.value,3)::bigint and LOWER(w.from_address) = LOWER(b.minter)
     and LOWER(w.to_address) = ${userAddress.toLowerCase()} and b.game_id = ${gameId}`;

  //Note: remove duplicate badges from the same contract:tokenId
  const addressSet: Set<string> = new Set();
  let results: Badge[] = [];
  for (const d of data as any[]) {
    const key = d.contract_address + '::' + d.token_id;
    if (!addressSet.has(key)) {
      addressSet.add(key);
      results.push(mapToBadge(d));
    }
  }

  return NextResponse.json(results);
}

function mapToBadge(b: QueryData): Badge {
  console.log('queryData:', b);
  return {
    id: b.id.toString(),
    name: b.name,
    description: '',
    imageUrl: new URL(b.image_url),
    isCompleted: b.to_address != null,
    type: b.type,
    txHash: b.transaction_hash,
    completedTimestamp: b.created_at,
    contractAddress: b.contract_address,
    tokenId: b.token_id,
    ctaText: b.cta_text,
    ctaUrl: b.cta_url,
  };
}
