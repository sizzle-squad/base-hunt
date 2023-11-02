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

export type Badge = {
  id: string;
  title: string;
  description: string;
  nftUrl: string;
  isCompleted: boolean;
  type: BadgeTypeEnum;
  txHash: string | null;
  completedTimestamp: string | null;
};
