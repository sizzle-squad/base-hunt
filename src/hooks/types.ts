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
  imageUrl: string;
  prizeImageUrl: string;
  prizeDescription: string;
  ctaUrl: string;
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

export type ReferralData = {
  referralCode: string;
  numReferrals: bigint;
};
export type ProfileBadge = {
  id: string;
  name: string;
  gameId: string;
};

export type LevelData = {
  currentLevel: Level | null;
  nextLevel: Level | null;
};

export type ProfileState = {
  isOptedIn: boolean;
  scoreData: Score | null;
  levelData: LevelData;
  referralData: ReferralData;
  numChallengesCompleted: bigint;
  badges: ProfileBadge[];
};

export enum SpinOptionTypeEnum {
  POINTS = 'POINTS',
  USDC = 'USDC',
  // can have different spin rewards in the future
}

export type SpinOption = {
  id: number;
  points: number;
  probability: number;
  type: SpinOptionTypeEnum;
};

export type SpinData = {
  id: string;
  gameId: string;
  userAddress: string;
  hasAvailableSpin: boolean;
  lastSpinResult: SpinOption | null;
};

export type SpinTheWheelState = {
  spinOptions: SpinOption[]; // array of possible spin the wheel options
  spinData: SpinData;
};

export type ChallengeMetricsState = {
  id: number;
  challengeId: string;
  numCompletions: number;
  name: string;
  points: number;
};

export type ChallengeCompletionState = {
  id: number;
  challengeId: string;
  hasCompleted: boolean;
};

export type BadgeState = {
  badgeId: number;
  badgeName: string;
  challengeId: string;
  checkFunction: string;
  challengeType: string;
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

export type Challenge = {
  id: number;
  challengeId: string;
};

export enum ChallengeTypeEnum {
  TRANSFER_ERC_20 = 'EVENT_TYPE_TRANSFER_ERC20',
  TRANSFER_NFT_721 = 'EVENT_TYPE_TRANSFER_ERC721',
  TRANSFER_NFT_1155 = 'EVENT_TYPE_TRANSFER_ERC1155',
  SOCIAL = 'SOCIAL',
  BALANCE_CHECK = 'BALANCE_CHECK',
  ERC_TRANSFER = 'ERC_TRANSFER',
  CONTRACT_INTERACTION = 'CONTRACT_INTERACTION',
  CONTRACT_EXECUTION = 'EVENT_TYPE_CONTRACT_EXECUTION',
  TRIVIA = 'TRIVIA',
  GUILD = 'GUILD',
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

export type Guild = {
  id: string;
  name: string;
  gameId: number;
  totalMemberCount: number | null;
  totalReferralCount: number | null;
  leader: string;
  currentScore: number;
  rank: string;
  imageUrl: string | null;
  winShares: number;
  socialLink: string | null;
  isEnabled: boolean;
};

export enum AirdropUSDCValue {
  FIVE = 'airdrop-stw-5',
  TEN = 'airdrop-stw-10',
  ONE_HUNDRED = 'airdrop-stw-100',
}
