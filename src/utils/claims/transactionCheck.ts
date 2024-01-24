import { ethers } from 'ethers';
import { WebhookData } from '../webhook';
import { Networks } from '../database.enums';
import { providers } from '../ethereum';

export type CheckExectionParams = {
  function: string;
} & WebhookData;

export async function checkFunctionExecution(
  params: CheckExectionParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const selector = ethers.id(params.function).substring(0, 10);
  let tx = await provider.getTransaction(params.transaction_hash);
  return tx?.data.startsWith(selector) ?? false;
}
