import { ethers } from 'ethers';
import axios from 'axios';

const CHROME_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// Set default headers for all axios requests
axios.defaults.headers.common = {
  'User-Agent': CHROME_USER_AGENT,
  'Accept': '*/*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
  'X-Appsflyer-Id': 'web'
};

import { isStringAnInteger } from '../integer';

export const verifyOwnershipByCollectionUrl =
  'https://api.wallet.coinbase.com/rpc/v3/collectibles/claims/verifyOwnershipByCollection';

const balanceOfABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const balanceOfTokenIdABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_id',
        type: 'uint256',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export type CheckBalanceConfiguration = {
  contractAddress: string;
  tokenAmount: string;
  tokenId?: string;
};

export type CheckBalanceParams = {
  userAddress: string;
} & CheckBalanceConfiguration;

export async function checkBalance(
  params: CheckBalanceParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const contract = new ethers.Contract(
    params.contractAddress,
    balanceOfABI,
    provider
  );
  const tokenAmount = isStringAnInteger(params.tokenAmount)
    ? params.tokenAmount
    : '1';
  const balance = await contract.balanceOf(params.userAddress);
  const b = ethers.getBigInt(balance);
  return b >= ethers.toBigInt(tokenAmount);
}

export async function checkTokenIdBalance(
  params: CheckBalanceParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const result = await axios.post(
    verifyOwnershipByCollectionUrl,
    {
      claimer: params.userAddress,
      contractAddress: params.contractAddress,
      chainId: '8453',
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Appsflyer-Id': 'web'
      },
    }
  );

  return Boolean(result.data.verified);
}
