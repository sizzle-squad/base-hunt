import { ethers } from 'ethers';
import { WALLET_API_BASE_URL, networkToChainId } from '../constants';

type Params = {
  userAddress: `0x${string}`;
  chainId: number;
};

export type CheckTokensConfiguration = {
  network: string;
  params: {
    gte: number;
  };
};

export type CheckTokensCount = {
  userAddress: string;
} & CheckTokensConfiguration;

type Balance = {
  chainId: number;
  contractAddress: string;
  tokenBalance: string;
};

type BalancesResponse = {
  result: {
    balances: {
      address: string;
      balances: Balance[];
    }[];
  };
};

type CollectiblesResponse = {
  result: {
    tokens: {
      chainId: string;
    }[];
  };
};

async function getAllBalancesForChain({ userAddress, chainId }: Params) {
  const url = `${WALLET_API_BASE_URL}/rpc/v2/getAllBalancesForChain?addresses=${userAddress}&chainId=${chainId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Coinbase API fetch failed:', response.status);
      return null;
    }

    const result: BalancesResponse = await response.json();
    return result.result;
  } catch (error) {
    console.error('Coinbase API fetch failed:', error);
    return null;
  }
}

async function getCollectiblesPortfolioTokens({
  userAddress,
  chainId,
}: Params) {
  const url = `${WALLET_API_BASE_URL}/rpc/v2/collectibles/portfolio/tokens?chains=${chainId}&evmAddress=${userAddress}&limit=50`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Coinbase API fetch failed:', response.status);
      return null;
    }

    const result: CollectiblesResponse = await response.json();
    const numberOfTokens = result?.result?.tokens?.length;
    return numberOfTokens;
  } catch (error) {
    console.error('Coinbase API fetch failed:', error);
    return null;
  }
}

export async function checkTokensCount(
  params: CheckTokensCount,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const userAddress: `0x${string}` = params.userAddress as `0x${string}`;
  const gte = params.params.gte || 5;
  const chainId = networkToChainId[params.network] || 8453;
  const result = await getAllBalancesForChain({
    userAddress: userAddress,
    chainId: chainId,
  });
  if (!result) {
    return false;
  }

  for (let i = 0; i < result.balances.length; i++) {
    const balance = result.balances[i];
    if (balance.address.toLowerCase() === userAddress.toLowerCase()) {
      if (balance.balances.length >= gte) {
        return true;
      }
    }
  }

  return false;
}

export async function checkNftTokensCount(
  params: CheckTokensCount,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const userAddress: `0x${string}` = params.userAddress as `0x${string}`;
  const gte = params.params.gte || 5;
  const chainId = networkToChainId[params.network] || 8453;
  const numTokens = await getCollectiblesPortfolioTokens({
    userAddress: userAddress,
    chainId: chainId,
  });
  if (!numTokens) {
    return false;
  }

  if (numTokens >= gte) {
    return true;
  }

  return false;
}
