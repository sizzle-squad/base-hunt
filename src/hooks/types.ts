type ProfileTextRecordsType = {
  avatar: string;
};

type EnsDomainProfileType = {
  name: string;
  profileTextRecords: ProfileTextRecordsType;
  visible: boolean;
};

type SubdomainProfileType = EnsDomainProfileType & {
  coinAddresses: Record<string, string>;
};

export type UserPublicProfile = {
  data: {
    address: `0x${string}`;
    ensDomainProfile: EnsDomainProfileType;
    primaryDomainType: 'cbid' | 'ens' | 'none';
    subdomainProfile: SubdomainProfileType;
  };
};

export enum BadgeTypeEnum {
  Online = 'online',
  IRL = 'irl',
}

export type Address = string;

export type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: URL;
  isCompleted: boolean;
  type: BadgeTypeEnum;
  txHash: string | null;
  completedTimestamp: Date | null;
  contractAddress: Address | null;
  tokenId: bigint;
  ctaText: string;
  ctaUrl: string;
  latLng: string;
};

export type Level = {
  id: string;
  gameId: string;
  name: string;
  thresholdPoints: bigint;
  level: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';
  description: string;
};

export type Score = {
  id: string;
  gameId: string;
  userAddress: string;
  currentScore: bigint;
  updatedAt: string;
};

export type ScoreState = {
  currentLevel: Level | null;
  nextLevel: Level | null;
  score: Score | null;
};

export type TreasureBoxState = {
  id: bigint;
  createdAt: Date;
  totalHitpoints: bigint;
  gameId: bigint;
  name: string;
  location: string;
  currentHitpoints: bigint;
  isOpen: boolean;
};

export type Rank = {
  cbid: string | null;
  createdAt: string;
  ensName: string | null;
  gameId: number;
  id: number;
  tapCount: number;
  totalHitpoints: number;
  userAddress: string;
};

export type ExtendedDocument = {
  startViewTransition?: any;
} & Document;
