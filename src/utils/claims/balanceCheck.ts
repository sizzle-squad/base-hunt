import { BigNumberish, ethers } from 'ethers';
import { Network, providers } from '../ethereum';
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

async function _checkBalance(
  network: Network,
  userAddress: string,
  contractAddress: string
): Promise<ethers.BigNumberish> {
  const provider = providers[network];
  const contract = new ethers.Contract(contractAddress, balanceOfABI, provider);
  const balance = await contract.balanceOf(userAddress);
  return balance;
}

async function _checkTokenIdBalance(
  network: Network,
  userAddress: string,
  contractAddress: string,
  tokenId: ethers.BigNumberish
): Promise<ethers.BigNumberish> {
  const provider = providers[network];
  const contract = new ethers.Contract(
    contractAddress,
    balanceOfTokenIdABI,
    provider
  );
  const balance = await contract.balanceOf(userAddress, tokenId);
  return balance;
}

export type CheckBalanceParams = {
  gte: string;
};

export async function checkBalance(
  event: WebhookData,
  params: CheckBalanceParams,
  network: Network
): Promise<boolean> {
  const provider = providers[network];
  const contract = new ethers.Contract(
    event.contract_address,
    balanceOfABI,
    provider
  );
  const balance = await contract.balanceOf(event.to_address);
  const b = ethers.getBigInt(balance);
  return b > ethers.toBigInt(params.gte);
}
