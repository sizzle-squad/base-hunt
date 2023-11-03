import type { NextApiResponse, NextApiRequest } from 'next';

import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types';

// type commandOp = {
//   command: string,
//   targetUrl: string,
//   userAddress: string
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL as string,process.env.SUPABASE_SERVICE_ROLE_KEY as string)    
    const rows = await supabase.from("webhook_data").insert(req.body)
    console.log(JSON.stringify(rows))
    return res.json({ status: 'ok' });
  }
}
