import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export async function POST(req: Request) {
    const body = await req.json()
    const webhook_data = await prisma.webhook_data.create({
        data: {
        ...body
        },
    })
    console.log(JSON.stringify(webhook_data))
    return Response.json({ status: 'ok' });
}
