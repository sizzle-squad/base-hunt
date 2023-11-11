import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import '@/utils/helper';
import { Badge } from '../../../../hooks/types';

const prisma = new PrismaClient()

export async function GET(req: Request) {

    const {searchParams} = new URL(req.url);
     //queryRaw is safe: https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw
     const data = await prisma.$queryRaw`select  b.name,b.image_url,b.contract_address,b.token_id,b.cta_url,b.cta_text,b.type,w.to_address,w.transaction_hash,w.created_at,w.event_type from badge_configuration as b LEFT join webhook_data as w
     on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = substring(w.value,3)::bigint and LOWER(w.from_address) = LOWER(b.minter)
     and LOWER(w.to_address) = ${(searchParams.get("userAddress") as string).toLowerCase()} and b.game_id = ${( BigInt(searchParams.get("gameId") as string))}`
          
     //Note: remove duplicate badges from the same contract:tokenId
     const addressSet: Set<string> = new Set();
     let results:Badge[] = [];
     for (const d of (data as any[])) {
        const key = d.contract_address+"::"+d.token_id
        if (!addressSet.has(key)) {
            addressSet.add(key);
            results.push(mapToBadge(d));
        }
    }
    return NextResponse.json(results);
}


function mapToBadge(b:any):Badge {
    return {
        id: b.id,
        name: b.name,
        description: "",
        imageUrl: b.image_url,
        isCompleted: b.to_address != null,
        type: b.type,
        txHash: b.transaction_hash,
        completedTimestamp: b.created_at,
        contractAddress: b.contract_address,
        tokenId: b.token_id,
        ctaText:b.cta_text,
        ctaUrl:b.cta_url
    }
}