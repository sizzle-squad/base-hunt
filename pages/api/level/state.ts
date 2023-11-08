import type { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';
import 'utils/helper';

const prisma = new PrismaClient()


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    //queryRaw is safe: https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw
    const data = await prisma.$queryRaw`select  b.name,b.contract_address,b.token_id,b.cta_url,b.cta_text,w.to_address,w.transaction_hash,w.created_at,w.event_type from badge_configuration as b LEFT join webhook_data as w
    on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = substring(w.value,3)::bigint and LOWER(w.from_address) = LOWER(b.minter)
    and LOWER(w.to_address) = ${(req.query.userAddress as string).toLowerCase()} and b.game_id = ${( BigInt(req.query.gameId as string))}`
    
    return res.json(data);
  }
}
