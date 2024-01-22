import ethers from 'ethers';

export enum Network {
  BaseMainnet = 'base-mainnet',
  EthMainnet = 'eth-mainnet',
}

export const BASE_NODE_URL = process.env.BASE_NODE_URL;
export const ETH_NODE_URL = process.env.ETH_NODE_URL;

export const providers: { [id: string]: ethers.JsonRpcProvider } = {
  BaseMainnet: new ethers.JsonRpcProvider(BASE_NODE_URL),
  EthMainnet: new ethers.JsonRpcProvider(ETH_NODE_URL),
};
