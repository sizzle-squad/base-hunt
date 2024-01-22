import axios from 'axios';
import { BASE_NODE_URL, Network, providers } from '../ethereum';
import { ethers } from 'ethers';

const MAX_FETCH = 10;

interface Result {
  addressMeta: any;
  paginationToken: string;
  spamScoreThresholds: any;
  transactions: TxHistoryTransaction[];
}

interface Transfer {
  amount: string;
  assetAddress: string;
  fromAddress: string;
  toAddress: string;
  tokenId: string;
}

export interface TxHistoryTransaction {
  blockNumber: string;
  feeAmount: string;
  hash: string;
  historicalAssetPricesUsd: any;
  nonce: number;
  primaryAction: any;
  status: string;
  timestamp: string;
  transfers: Transfer[];
}
export async function getTxHistoryForAddress(
  userAddress: string,
  network: Network
): Promise<TxHistoryTransaction[]> {
  let counter = 0;
  let transactions = [];
  let result = await axios.post<Result>(
    `https://api.wallet.coinbase.com/rpc/v3/txHistory/getForAddress`,
    {
      address: userAddress,
      network: network,
    }
  );
  transactions.push(...result.data.transactions);
  while ((result.data && result.data.paginationToken) || counter > MAX_FETCH) {
    result = await axios.post<Result>(
      `https://api.wallet.coinbase.com/rpc/v3/txHistory/getForAddress`,
      {
        address: userAddress,
        network: network,
        paginationToken: result.data.paginationToken,
      }
    );
    transactions.push(...result.data.transactions);
  }
  return transactions;
}

export async function getTxCountBatch(
  userAddresses: string[],
  network: Network
): Promise<BigInt> {
  const r = userAddresses.map((a, idx) => {
    return { id: idx, jsonrpc: '2.0', method: 'string', params: [a] };
  }) as Array<{
    id: number;
    jsonrpc: '2.0';
    method: string;
    params: Array<any>;
  }>;

  const results = await providers[network]._send(r);

  return results
    .map((r) => {
      return ethers.toBigInt(r.result);
    })
    .reduce((a, b) => a + b, ethers.toBigInt(0));
}
