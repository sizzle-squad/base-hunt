import { ethers } from 'ethers';
import { WebhookData } from '../webhook';
import { Networks } from '../database.enums';

export type CheckMintParams = {
  minter: string;
  tokenId?: string;
} & WebhookData;

export async function checkMint(
  params: CheckMintParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  return (
    params.from_address.toLowerCase() === params.minter.toLowerCase() &&
    (params.tokenId
      ? ethers.toBigInt(params.value) === ethers.toBigInt(params.tokenId)
      : true)
  );
}