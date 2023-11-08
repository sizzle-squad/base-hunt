import type { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client'
import { AirdropNft } from '@/utils/walletapi';
const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    console.log("trying to process claim:",JSON.stringify(req.body));
    return res.json({});
  }
}
