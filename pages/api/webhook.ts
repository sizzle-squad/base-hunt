import type { NextApiResponse, NextApiRequest } from 'next';

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
    console.log(JSON.stringify(req.body));
    return res.json({ status: 'ok' });
  }
}
