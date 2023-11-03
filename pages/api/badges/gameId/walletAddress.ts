import { NextApiRequest, NextApiResponse } from 'next';
import { Badge } from '@/hooks/types';
import { MOCK_BADGES } from '@/utils/mock/badges';

export type BadgeData = {
  irlBadges: Badge[],
  onlineBadges: Badge[],
}

export type GetBadgesResponse = {
  data: BadgeData;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<GetBadgesResponse | { message: string }>) {
  const { gameId, walletAddress } = req.query;

  if (req.method === 'GET') {
    if (typeof gameId === 'string' && typeof walletAddress === 'string') {
      res.status(200).json(MOCK_BADGES);
    } else {
      res.status(400).json({ message: 'Invalid gameId or walletAddress' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}