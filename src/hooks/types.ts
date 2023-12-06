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
  artistName: string;
};

export type Level = {
  id: string;
  gameId: string;
  name:
    | 'level-0'
    | 'level-1'
    | 'level-2'
    | 'level-3'
    | 'level-4'
    | 'level-5'
    | 'level-6'
    | 'level-7';
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
  ctaUrl: string;
};

export enum BoostIconEnum {
  WALLET = 'WALLET',
  COFFEE = 'COFFEE',
  BAG = 'BAG',
  GRID = 'GRID',
  CIRCLE = 'CIRCLE',
  LINK = 'LINK',
  USERS = 'USERS',
}

export type Boost = {
  icon: BoostIconEnum;
  description: string;
  id: bigint;
  name: string;
  contractAddresses: string[];
  imageUrl: string | null;
  gameId: bigint;
  ctaUrl: string | null;
  ctaText: string | null;
  ctaButtonText: string | null;
  boostType: string;
  isEnabled: boolean;
  points: bigint;
  nftAmount: bigint | null;
  claimed: boolean;
};

export enum BoostTypeEnum {
  TRANSFER_NFT = 'TRANSFER_NFT',
  NFT = 'NFT',
  NFT_PER_MINT = 'NFT_PER_MINT',
  TOKEN = 'TOKEN',
  TRANSACTION = 'TRANSACTION',
  DEFAULT = 'DEFAULT',
}

export type PlayerRank = {
  rank: string;
  userAddress: `0x${string}`;
  currentScore: number;
};

export type Rank = {
  cbid: string | null;
  createdAt: string;
  ensName: string | null;
  gameId: number;
  id: number;
  tapCount: number;
  currentScore: number;
  userAddress: string;
};

export type ExtendedDocument = {
  startViewTransition?: any;
} & Document;

export type LevelState = Level & {
  imageUrl: string;
  transactionHash: string;
  isClaimed: boolean;
};

export type TreasureBoxEntry = {
  userAddress: string;
  totalHitpoints: bigint;
  gameId: bigint;
  tapCount: bigint;
  updatedAt: Date;
  createdAt: Date;
  isCTAEligible: boolean;
  nextEligibleDate: Date;
};
