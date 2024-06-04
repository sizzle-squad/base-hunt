import axios from 'axios';
import { ethers, Wallet } from 'ethers';

const domain = {
  name: 'AirdropCommand',
  version: '1.0.0',
  chainId: 8453,
  verifyingContract: '0x0000000000000000000000000000000000000000',
};

const types = {
  AirdropCommandData: [
    { name: 'userAddress', type: 'address' },
    { name: 'command', type: 'string' },
    { name: 'nonce', type: 'string' },
  ],
};

const airdropUrl = process.env.AIRDROP_URL as string;

export async function airdropNft(
  userAddress: string,
  command: string,
  nonce?: string
) {
  const wallet = new Wallet(
    process.env.AUTHORIZER_PK as string,
    new ethers.JsonRpcProvider('https://mainnet.base.org')
  );
  console.log('[AirdropNft] loaded wallet:', wallet.address);

  const message = {
    userAddress: userAddress,
    command: command,
    nonce:
      nonce ??
      ethers.keccak256(ethers.toUtf8Bytes('__ocs_gamification_2024__')),
  };

  const signature = ethers.Signature.from(
    await wallet.signTypedData(domain, types, message)
  );
  console.log(JSON.stringify(signature));

  const postData = {
    ...message,
    signature: {
      r: signature.r,
      s: signature.s,
      v: signature.v,
    },
  };

  console.log('[AirdropNft] postData:', postData);
  if (process.env.AIRDROP_ENABLED) {
    const response = await axios.post(airdropUrl, postData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('[AirdropNft] response:', response.data);
    if (response.status != 200) {
      console.error('[AirdropNft] error airdropping:', response.data);
      return;
    }
  } else {
    console.log('[AirdropNft] airdrop disabled');
  }
  console.log('[AirdropNft] airdrop completed');
}
