import { useMemo } from 'react';

import { getTruncatedAddress } from '@/utils/truncate';

type Props = {
  address: `0x${string}` | string | undefined;
  userPublicProfile?: {
    subdomainProfile?: {
      name: string;
    };
    ensDomainProfile?: {
      name: string;
    };
  };
};

export const useUserName = ({ address, userPublicProfile }: Props) => {
  return useMemo(() => {
    if (userPublicProfile) {
      if (userPublicProfile.ensDomainProfile) {
        return userPublicProfile.ensDomainProfile.name;
      } else if (userPublicProfile.subdomainProfile) {
        return userPublicProfile.subdomainProfile.name;
      }
    }

    return address && getTruncatedAddress(address);
  }, [address, userPublicProfile]);
};
