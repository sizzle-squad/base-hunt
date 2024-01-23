import { ethers } from 'ethers';
import { WebhookData } from '../webhook';
import { Networks } from '../database.enums';

export interface CheckMintParams {
  minter: string;
  tokenId?: string;
}

export async function checkMint(
  webhookData: WebhookData,
  params: CheckMintParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  return (
    webhookData.from_address.toLowerCase() === params.minter.toLowerCase() &&
    (params.tokenId
      ? ethers.toBigInt(webhookData.value) === ethers.toBigInt(params.tokenId)
      : true)
  );
}
