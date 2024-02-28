import { ethers } from 'ethers';

import { Networks } from '../database.enums';
import { providers } from '../ethereum';
import { WebhookData } from '../webhook';

export type CheckExectionParams = {
  function: string;
} & WebhookData;

export async function checkFunctionExecution(
  params: CheckExectionParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const selector = ethers.id(params.function).substring(0, 10);
  const tx = await provider.getTransaction(params.transaction_hash);
  if (!tx) {
    console.warn('Transaction not found', params.transaction_hash);
  }
  return tx?.data.startsWith(selector) ?? false;
}
