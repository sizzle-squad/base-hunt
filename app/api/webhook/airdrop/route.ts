import { PrismaClient } from '@prisma/client'
import { AirdropNft } from '@/utils/walletapi';
const prisma = new PrismaClient()

/*
curl -X POST 'http://localhost:3000/api/level/airdrop' -d '{
    "type": "UPDATE",
    "table": "score",
    "record": {
        "id": "3",
        "game_id": "0",
        "updated_at": "2023-11-09T02:22:09.379",
        "user_address": "0xa14a25930babc1220df002070be86b030b1d4c68",
        "current_score": "3"
    },
    "schema": "public",
    "old_record": {
        "id": "3",
        "game_id": "0",
        "updated_at": "2023-11-09T02:22:09.379",
        "user_address": "0xa14a25930babc1220df002070be86b030b1d4c68",
        "current_score": "2"
    }
}'  -H 'Content-Type: application/json'
*/

export async function POST(req: Request) {
    console.log("[webhook airdrop]")
    const body = await req.json()
    if (body.type as string === "UPDATE" && body.table as string === "score"){
        const currentScore = BigInt(body.record.current_score)
        const level = await prisma.level_configuration.findFirst({
            where:{
                game_id:BigInt(body.record.game_id),
                threshold_points:currentScore            
            }
        })
        if (level) {
            AirdropNft(body.record.user_address,level.airdrop_command)
        }else{
            console.log("[webhook airdrop] no level found:",body.record.game_id,body.record.user_address,currentScore)
        }

    }else{
        console.warn("[webhook airdrop] unsupported type:",body.type,body.table)
    }

    return Response.json({});
}