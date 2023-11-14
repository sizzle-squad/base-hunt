import { PrismaClient } from '@prisma/client'
import { AirdropNft } from '@/utils/walletapi';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient()

export async function POST(req: Request) {
    console.log("[webhook airdrop]")
    const body = await req.json()
    if ( body.table as string === "treasure_box_entries"){
        let totalAttack = body.record.total_hitpoints
        if(body.type as string === "UPDATE"){
           totalAttack - body.old_record.total_hitpoints;
        }
        console.log("updating with totalAttack:",totalAttack, "userAddress",body.record.user_address, "gameId",body.record.game_id);       
        const tb = await prisma.treasure_box_state.upsert({
            where: {
              user_address: body.record.user_address,
              game_id: body.record.game_id,
            },
            create: {
              current_hitpoints: totalAttack,
              is_open: false,             
            },
            update: {
              current_hitpoints: {
                increment: totalAttack,
              },              
            },
          });
          console.log(tb);
    }
    else{
        console.warn("[webhook airdrop] unsupported type:",body.type,body.table)
    }
    return NextResponse.json({});
}