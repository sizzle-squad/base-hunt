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
  const txReceipt = await provider.waitForTransaction(
    params.transaction_hash,
    1,
    500
  ); //this gets the receipt
  if (!txReceipt || !txReceipt.status) {
    console.warn('tx-receipt failed:', params);
    return false;
  }
  const tx = await provider.getTransaction(params.transaction_hash);
  if (!tx) {
    console.error('tx-hash failed:', params);
  }
  return tx?.data.startsWith(selector) ?? false;
}
