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
  tokenId: string;
  gte: string;
};

export type CheckBalanceParams = {
  gte: string;
};

export async function checkBalance(
  event: WebhookData,
  params: CheckBalanceParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const contract = new ethers.Contract(
    event.contract_address,
    balanceOfABI,
    provider
  );
  const balance = await contract.balanceOf(event.to_address);
  const b = ethers.getBigInt(balance);
  return b > ethers.toBigInt(params.gte);
}

export async function checkTokenIdBalance(
  event: WebhookData,
  params: CheckTokenIdBalanceParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const contract = new ethers.Contract(
    event.contract_address,
    balanceOfTokenIdABI,
    provider
  );
  const balance = await contract.balanceOf(event.to_address, params.tokenId);
  const b = ethers.getBigInt(balance);
  return b > ethers.toBigInt(params.gte);
}
