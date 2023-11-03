import { NextApiRequest, NextApiResponse } from 'next';
import { Badge } from '@/hooks/types';
import { MOCK_IRL_BADGES, MOCK_ONLINE_BADGES } from '@/utils/mock/badges';

export type GetBadgeResponse = {
  data: Badge;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<GetBadgeResponse | { message: string }>) {
  const { gameId, badgeId, walletAddress } = req.query;

  if (req.method === 'GET') {
    if (typeof badgeId === 'string' && typeof gameId === 'string' && typeof walletAddress === 'string') {
      const filteredBadges = [...MOCK_IRL_BADGES, ...MOCK_ONLINE_BADGES].filter((badge) => badge.id === badgeId);
      if (filteredBadges.length > 0) {
        const responseData = { data: filteredBadges[0] };
        res.status(200).json(responseData);
      } else {
        res.status(404).json({ message: 'Badge not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid gameId, badgeId, or walletAddress' });
    }
  } else if (req.method === 'POST') {
    const { gameId, badgeId, walletAddress } = req.body;
    if (typeof badgeId === 'string' && typeof gameId === 'string' && typeof walletAddress === 'string') {
      const badgeCanBeClaimed = true;
      // TODO: Update badge state in database
      if (badgeCanBeClaimed) {
        res.status(200).json({ message: `Badge ${badgeId} claimed successfully for wallet ${walletAddress}` });
      } else {
        res.status(400).json({ message: 'Badge cannot be claimed' });
      }
    } else {
      res.status(400).json({ message: 'Invalid badgeId or walletAddress' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}