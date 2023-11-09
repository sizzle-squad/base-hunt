import type { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client'
import { AirdropNft } from '@/utils/walletapi';
const prisma = new PrismaClient()

/*
curl -X POST 'http://localhost:3000/api/level/claim' -d ' body: {
  type: 'UPDATE',
  table: 'score',
  record: {
    id: 3,
    game_id: 0,
    updated_at: '2023-11-09T02:22:09.379',
    user_address: '0xa14a25930babc1220df002070be86b030b1d4c68',
    current_score: 2
  },
  schema: 'public',
  old_record: {
    id: 3,
    game_id: 0,
    updated_at: '2023-11-09T02:22:09.379',
    user_address: '0xa14a25930babc1220df002070be86b030b1d4c68',
    current_score: 1
  }
}'  -H 'Content-Type: application/json'
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    console.log("[webhook airdrop]")
    if (req.body.type as string === "UPDATE" && req.body.table as string === "score"){
        const currentScore = BigInt(req.body.record.current_score)
        const level = await prisma.level_configuration.findFirst({
            where:{
                game_id:BigInt(req.body.record.game_id),
                threshold_points:currentScore            
            }
        })
        if (level) {
            AirdropNft(req.body.record.user_address,level.airdrop_command)
        }else{
            console.log("[webhook airdrop] no level found:",req.body.record.game_id,req.body.record.user_address,currentScore)
        }

    }else{
        console.warn("[webhook airdrop] unsupported type:",req.body.type,req.body.table)
    }

    return res.json({});
  }
  
}
