import { ethers, FetchRequest } from 'ethers';

import { Networks } from './database.enums';

export const BASE_NODE_URL = process.env.BASE_NODE_URL;
export const ETH_NODE_URL = process.env.ETH_NODE_URL;

const fetchReq = new FetchRequest(process.env.TPP_NODE_URL as string);
fetchReq.setHeader(
  'x-tpp-routing-rule',
  process.env.TPP_ROUTING_RULE as string
);
fetchReq.setHeader(
  'x-tpp-client-project-name',
  process.env.TPP_PROJECT_NAME as string
);

export const providers: { [key in Networks]: ethers.JsonRpcProvider } = {
  [Networks.networks_base_mainnet]: new ethers.JsonRpcProvider(fetchReq),
  [Networks.networks_eth_mainnet]: new ethers.JsonRpcProvider(ETH_NODE_URL),
};
