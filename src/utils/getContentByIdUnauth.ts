import { ocsChallengeCard } from '@/app/api/challenges/complete/route';
import { WALLET_API_BASE_URL } from '@/utils/constants';

type ExploreContentResponse = {
  content: {
    ocsChallengeCard: ocsChallengeCard;
  };
};

export async function getContentByIdUnauth(contentId: string) {
  const url = `${WALLET_API_BASE_URL}/rpc/v2/explore/getContentByIdUnauth?surface=1&id=${contentId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Gamification',
      },
    });

    if (!response.ok) {
      console.error('Coinbase API fetch failed:', response.status);
      return null;
    }

    const result: ExploreContentResponse = await response.json();
    return result.content;
  } catch (error) {
    console.error('Coinbase API fetch failed:', error);
    return null;
  }
}
