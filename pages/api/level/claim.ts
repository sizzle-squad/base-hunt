import type { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/*
curl -X POST 'http://localhost:3000/api/level/claim' -d ' {"type":"INSERT","table":"webhook_data","record":{"value":"0x0000000000000000000000000000000000000000000000000000000000000002","log_index":"0x0","block_hash":"0x7b247ffeae4605413ae1729d51f0c5c8ad4df8f92e18cdfeedbf2a44bb391f8f","created_at":"2023-11-08T09:01:57.114+00:00","event_type":"EVENT_TYPE_TRANSFER_ERC1155","network_id":"networks/base-goerli-testnet","to_address":"0xa14a25930babc1220df002070be86b030b1d4c68","from_address":"0x4c64c7dc4fc7ba5b89fad3aebc68892bfc1b67d5","block_timestamp":"seconds:1699434114","contract_address":"0x68814e0f414b8fbcf984d3af85edfa365ef7254c","transaction_hash":"0x67b0c7879ea1821a5ff8e68ce43b48be98fab6f27addc9db3c51cce534513629","is_to_address_cbw":true,"is_from_address_cbw":true},"schema":"public","old_record":null}'  -H 'Content-Type: application/json'
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    console.log("body:",req.body)
    const badge = await prisma.badge_configuration.findFirst({
      where: {
        contract_address: {
            equals: req.body.record.contract_address,
            mode: 'insensitive'
        },
        token_id: BigInt(req.body.record.value),
        minter: {
            equals: req.body.record.from_address,
            mode: 'insensitive'
        },
      }
    })
    console.log("badge:",badge);
    if(badge !=null){
      const prevScore = await prisma.score.findFirst({
        where: {
          user_address: {
              equals: req.body.record.to_address,
              mode: 'insensitive'
          },
          game_id: badge.game_id,          
        }
      })
      console.log("current score:", prevScore)
      //get current score from db 
      const badges = await prisma.$queryRaw`select DISTINCT b.contract_address,b.token_id,b.game_id,b.points from badge_configuration as b join webhook_data as w
      on LOWER(b.contract_address) = LOWER(w.contract_address) and b.token_id::bigint = substring(w.value,3)::bigint and LOWER(w.from_address) = LOWER(b.minter)
      and LOWER(w.to_address) = ${(req.body.record.to_address).toLowerCase()} and b.game_id = ${badge.game_id}`
      
      console.log("collected badges:", badges)  
        const newScore = (badges as any[]).reduce((a:BigInt, b:any) => a + b.points, 0)
      if (prevScore == null){
        console.log("insert new score",newScore)
        //create new score
        const insert = await prisma.score.create({
          data: {
            user_address: req.body.record.to_address,
            game_id: badge.game_id,
            current_score: newScore,
          },
        })
        console.log("inserted new score:", insert)
      // //update current score to score + 1
      }else{
        if (prevScore.current_score < newScore){
          console.log("update new score",newScore)
          // update current score to score + 1
          const update = await prisma.score.update({
            where: {
              id: prevScore.id,
            },
            data: {
              current_score: newScore,
            },
          })
          console.log("compare and update new score",newScore);
        }else{
          console.error("new score is lower than current score, do nothing:",prevScore,newScore)
        }
        
      }
      
      
    }
    return res.json({});
  }
  
}
