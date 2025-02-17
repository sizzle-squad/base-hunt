import axios from 'axios';
import { ethers } from 'ethers';

import { Networks } from '../database.enums';
import { providers } from '../ethereum';

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

export type CheckTxCountBatchConfiguration = {
  contract_address: string;
  tokenAmount: number;
};

export type CheckTxCountBatchParams = {
  userAddress: string;
} & CheckTxCountBatchConfiguration;

export type GetTxCountBatchParams = {
  userAddresses: string[];
} & CheckTxCountBatchConfiguration;

export async function getTxHistoryForAddress(
  userAddress: string,
  network: Networks
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

export async function checkTxCountBatch(
  params: CheckTxCountBatchParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const rr = await getTxCountBatch([params.userAddress], provider);
  return rr >= ethers.toBigInt(params.tokenAmount as number);
}

export async function getTxCountBatch(
  userAddresses: string[],
  provider: ethers.JsonRpcProvider
): Promise<bigint> {
  const reqs = userAddresses.map((a, idx) => {
    return {
      id: idx,
      jsonrpc: '2.0',
      method: 'eth_getTransactionCount',
      params: [a, 'latest'],
    };
  }) as Array<{
    id: number;
    jsonrpc: '2.0';
    method: string;
    params: Array<any>;
  }>;
  const results = await provider._send(reqs);
  const sum = results
    .map((r) => {
      return ethers.toBigInt(r.result);
    })
    .reduce((a, b) => a + b, ethers.toBigInt(0));
  return sum;
}
