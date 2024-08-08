import { ethers } from 'ethers';
import axios from 'axios';
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
      },
    }
  );

  return Boolean(result.data.verified);
}
