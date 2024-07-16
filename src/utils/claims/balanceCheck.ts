import { ethers } from 'ethers';
import { Alchemy, Network } from 'alchemy-sdk';

import { isStringAnInteger } from '../integer';

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

const settings = {
  apiKey: process.env.ALCHEMY_ID,
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

async function verifyNftOwnership(userAddress: string, contract: string) {
  const response = await alchemy.nft.verifyNftOwnership(userAddress, contract);
  return response;
}

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
  const isAnOwner = await verifyNftOwnership(
    params.userAddress,
    params.contractAddress
  );

  return isAnOwner;
}
