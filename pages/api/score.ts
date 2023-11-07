import type { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

Object.defineProperty(BigInt.prototype, "toJSON", {
    get() {
        "use strict";
        return () => String(this);
    }
});
  
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const data = await prisma.$queryRaw`select  b.name,b.contract_address,w.to_address,b.token_id from badge_configuration as b LEFT join webhook_data as w
    on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = substring(w.value,3)::bigint and LOWER(w.from_address) = LOWER(b.minter)
    and LOWER(w.to_address) = ${(req.query.userAddress as string).toLowerCase()}`
    return res.json(data);
  }
}
