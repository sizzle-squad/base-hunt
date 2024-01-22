import ethers from 'ethers';
import { WebhookData } from '../webhook';
import { Network } from '../ethereum';

async function _parseTransaction(txHash: string) {
  let provider = new ethers.JsonRpcProvider(process.env.BASE_NODE_URL);
  let tx = await provider.getTransaction(txHash);
  return tx;
}

export type CheckExectionParams = {
  function: string;
};

export async function checkFunctionExecution(
  webhookData: WebhookData,
  params: CheckExectionParams,
  network: Network
): Promise<boolean> {
  const selector = ethers.id(params.function).substring(0, 10);
  let tx = await _parseTransaction(webhookData.transaction_hash);
  return tx?.data.startsWith(selector) ?? false;
}
