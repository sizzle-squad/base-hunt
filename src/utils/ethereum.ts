import { ethers } from 'ethers';
import { Networks } from './database.enums';

export const BASE_NODE_URL = process.env.BASE_NODE_URL;
export const ETH_NODE_URL = process.env.ETH_NODE_URL;

export const providers: { [key in Networks]: ethers.JsonRpcProvider } = {
  [Networks.networks_base_mainnet]: new ethers.JsonRpcProvider(BASE_NODE_URL),
  [Networks.networks_eth_mainnet]: new ethers.JsonRpcProvider(ETH_NODE_URL),
};
