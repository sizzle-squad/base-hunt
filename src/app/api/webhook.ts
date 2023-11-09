import type { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const webhook_data = await prisma.webhook_data.create({
      data: {
       ...req.body
      },
    })
   
    console.log(JSON.stringify(webhook_data))
    return res.json({ status: 'ok' });
  }
}
