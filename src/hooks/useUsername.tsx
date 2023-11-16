import { getTruncatedAddress } from '@/utils/truncate';
import { useMemo } from 'react';

type Props = {
  address: `0x${string}` | string;
  userPublicProfile?: {
    subdomainProfile?: {
      name: string;
    };
    ensDomainProfile?: {
      name: string;
    };
  };
};

export const useUserAddress = ({ address, userPublicProfile }: Props) => {
  return useMemo(() => {
    if (userPublicProfile) {
      if (userPublicProfile.subdomainProfile) {
        return userPublicProfile.subdomainProfile.name;
      } else if (userPublicProfile.ensDomainProfile) {
        return userPublicProfile.ensDomainProfile.name;
      }
    }

    return address && getTruncatedAddress(address);
  }, [address, userPublicProfile]);
};
