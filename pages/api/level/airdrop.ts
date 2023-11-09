import type { NextApiResponse, NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client'
import { AirdropNft } from '@/utils/walletapi';
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
        
    return res.json({});
  }
  
}
