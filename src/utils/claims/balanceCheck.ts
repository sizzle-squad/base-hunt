import { BigNumberish, ethers } from 'ethers';
import { WebhookData } from '../webhook';
import { Networks } from '../database.enums';
import { providers } from '../ethereum';
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

export type CheckTokenIdBalanceParams = {
  contractAddress: string;
  userAddress: string;
  tokenId: string;
  gte: string;
};

export type CheckBalanceParams = {
  userAddress: string;
  contractAddress: string;
  gte: string;
};

export async function checkBalance(
  params: CheckBalanceParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const contract = new ethers.Contract(
    params.contractAddress,
    balanceOfABI,
    provider
  );
  const balance = await contract.balanceOf(params.userAddress);
  const b = ethers.getBigInt(balance);
  return b > ethers.toBigInt(params.gte);
}

export async function checkTokenIdBalance(
  params: CheckTokenIdBalanceParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const contract = new ethers.Contract(
    params.contractAddress,
    balanceOfTokenIdABI,
    provider
  );
  const balance = await contract.balanceOf(params.userAddress, params.tokenId);
  const b = ethers.getBigInt(balance);
  return b > ethers.toBigInt(params.gte);
}
