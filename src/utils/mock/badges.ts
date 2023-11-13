import { Badge, BadgeTypeEnum } from '@/hooks/types';

export const MOCK_IRL_BADGES: Badge[] = [
  {
    id: '1',
    name: 'Badge 1',
    description: 'My Amazing badge 1',
    imageUrl: new URL(
      'https://i.seadn.io/gcs/files/5b38e880121af3c61e68a3599b51aa9c.png?auto=format&dpr=1&w=1000'
    ),
    isCompleted: false,
    type: BadgeTypeEnum.IRL,
    txHash: null,
    completedTimestamp: null,
    contractAddress: null,
    tokenId: null,
    ctaText:"cta_text",
    ctaUrl:"cta_url"
  },
  {
    id: '2',
    name: 'Badge 2',
    description: 'My Amazing badge 2',
    imageUrl: new URL(
      'https://i.seadn.io/gcs/files/5b38e880121af3c61e68a3599b51aa9c.png?auto=format&dpr=1&w=1000'
    ),
    isCompleted: true,
    type: BadgeTypeEnum.IRL,
    txHash: '0x123456789',
    completedTimestamp: new Date('2021-01-01'),
    contractAddress: null,
    tokenId: null,
    ctaText:"cta_text-2",
    ctaUrl:"cta_url-2"
  },
];

export const MOCK_ONLINE_BADGES: Badge[] = [
  {
    id: '1',
    name: 'Online Badge 1',
    description: 'My Amazing online badge 1',
    imageUrl: new URL(
      'https://i.seadn.io/s/raw/files/1c8f8cf5a8829456172fe35e68a1116e.png?auto=format&dpr=1&w=1000'
    ),
    isCompleted: false,
    type: BadgeTypeEnum.Online,
    txHash: '0x123456789',
    completedTimestamp: new Date('2021-01-01'),
    contractAddress: null,
    tokenId: null,
    ctaText:"cta_text",
    ctaUrl:"cta_url"
  },
  {
    id: '2',
    name: 'Online Badge 2',
    description: 'My Amazing online badge 2',
    imageUrl: new URL(
      'https://i.seadn.io/s/raw/files/1c8f8cf5a8829456172fe35e68a1116e.png?auto=format&dpr=1&w=1000'
    ),
    isCompleted: true,
    type: BadgeTypeEnum.Online,
    txHash: '0x123456789',
    completedTimestamp: new Date('2021-01-01'),
    contractAddress: null,
    tokenId: null,
    ctaText:"cta_text-2",
    ctaUrl:"cta_url-2"
  },
];

export const MOCK_BADGES = {
  data: {
    irlBadges: MOCK_IRL_BADGES,
    onlineBadges: MOCK_ONLINE_BADGES,
  },
};
