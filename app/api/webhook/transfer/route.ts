import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
const prisma = new PrismaClient()


export async function POST(req: Request) {
    const body = await req.json()
    const webhook_data = await prisma.webhook_data.create({
        data: {
        ...body
        },
    })
    console.log(JSON.stringify(webhook_data))
    return NextResponse.json({ status: 'ok' });
}
