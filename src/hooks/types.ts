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
    result: {
      address: `0x${string}`;
      ensDomainProfile: EnsDomainProfileType;
      primaryDomainType: 'cbid' | 'ens' | 'none';
      subdomainProfile: SubdomainProfileType;
    };
  };
};

export enum BadgeTypeEnum {
  Online = 'online',
  IRL = 'irl',
}

export type ChallengeTypeEnum = 'online' | 'irl';

export type Address = string;

export type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: URL;
  isCompleted: boolean;
  type: ChallengeTypeEnum;
  txHash: string | null;
  completedTimestamp: Date | null;
  contractAddress: Address | null;
  tokenId: bigint | null;
};
