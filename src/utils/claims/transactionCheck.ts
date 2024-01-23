import { ethers } from 'ethers';
import { WebhookData } from '../webhook';
import { Networks } from '../database.enums';
import { providers } from '../ethereum';

export interface CheckExectionParams {
  function: string;
}

export async function checkFunctionExecution(
  webhookData: WebhookData,
  params: CheckExectionParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  const selector = ethers.id(params.function).substring(0, 10);
  let tx = await provider.getTransaction(webhookData.transaction_hash);
  return tx?.data.startsWith(selector) ?? false;
}
