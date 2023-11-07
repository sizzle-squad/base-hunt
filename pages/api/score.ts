import type { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const data = await prisma.$queryRaw`SELECT * FROM "webhook_data" where "userAddress" = ${req.query.userAddress}`
    console.log(JSON.stringify(data))
    return res.json(data);
  }
}
