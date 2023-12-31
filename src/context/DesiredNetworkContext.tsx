'use client';

import {
  FC,
  PropsWithChildren,
  useRef,
  createContext,
  useEffect,
  useContext,
  useState,
} from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { base, baseGoerli, goerli, mainnet } from 'wagmi/chains';
import { WindowProvider } from 'wagmi';

interface CustomWindowProvider extends WindowProvider {
  isCoinbaseBrowser?: boolean;
}

const getIsCoinbaseBrowser = () => {
  if (typeof window === 'undefined') return false;
  // @ts-ignore
  const ethereum = window.ethereum as CustomWindowProvider | undefined;
  const isCoinbaseBrowser = ethereum?.isCoinbaseBrowser || false;
  return isCoinbaseBrowser;
};

export const isProd = process.env.NEXT_PUBLIC_CHAIN_ENV === 'mainnet';

export const l1 = isProd ? mainnet : goerli;
export const l2 = isProd ? base : baseGoerli;

interface IDesiredNetworkContext {
  desiredNetwork: typeof l1 | typeof l2;
  setDesiredNetwork: React.Dispatch<
    React.SetStateAction<typeof l1 | typeof l2>
  >;
}

export const DesiredNetworkContext = createContext<IDesiredNetworkContext>({
  desiredNetwork: l2,
  setDesiredNetwork: () => {},
});

export const DesiredNetworkContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const currentNetwork = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const switchNetworkRef = useRef(switchNetwork);

  switchNetworkRef.current = switchNetwork;

  const [desiredNetwork, setDesiredNetwork] = useState<typeof l1 | typeof l2>(
    l2
  );

  const currentNetworkId = currentNetwork.chain?.id;
  const desiredNetworkId = desiredNetwork.id;

  useEffect(() => {
    const isCoinbaseBrowser = getIsCoinbaseBrowser();
    if (
      isCoinbaseBrowser &&
      currentNetworkId &&
      currentNetworkId !== desiredNetworkId
    ) {
      switchNetworkRef.current?.(desiredNetworkId);
    }
  }, [desiredNetworkId, currentNetworkId]);

  return (
    <DesiredNetworkContext.Provider
      value={{ desiredNetwork, setDesiredNetwork }}
    >
      {children}
    </DesiredNetworkContext.Provider>
  );
};

export const useDesiredNetwork = () => {
  const context = useContext(DesiredNetworkContext);

  if (context === undefined) {
    throw new Error(
      'useDesiredNetwork must be used within a DesiredNetworkContextProvider'
    );
  }

  return context;
};
