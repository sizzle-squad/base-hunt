import { BigNumberish, ethers } from 'ethers';

import { Networks } from '../database.enums';
import { Database } from '../database.types';
import { providers } from '../ethereum';
import { WebhookData } from '../webhook';
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
  contract_address: string;
  params: {
    gte: number;
    tokenId?: number;
  };
};

export type CheckBalanceParams = {
  userAddress: string;
} & CheckBalanceConfiguration;

export async function checkBalance(
  params: CheckBalanceParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const contract = new ethers.Contract(
    params.contract_address,
    balanceOfABI,
    provider
  );
  const balance = await contract.balanceOf(params.userAddress);
  const b = ethers.getBigInt(balance);
  return b >= ethers.toBigInt(params.params.gte);
}

export async function checkTokenIdBalance(
  params: CheckBalanceParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const contract = new ethers.Contract(
    params.contract_address,
    balanceOfTokenIdABI,
    provider
  );
  const balance = await contract.balanceOf(
    params.userAddress,
    params.params.tokenId
  );
  const b = ethers.getBigInt(balance);
  return b >= ethers.toBigInt(params.params.gte);
}
