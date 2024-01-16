import ethers from 'ethers';

const balanceOfABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

let providers: { [id: string]: ethers.JsonRpcProvider } = {
  'base-mainnet': new ethers.JsonRpcProvider(process.env.BASE_NODE_URL),
  'eth-mainnet': new ethers.JsonRpcProvider(process.env.ETH_NODE_URL),
};

export async function getTokenBalance(
  address: string,
  tokenAddress: string,
  network: string
) {
  const c = new ethers.Contract(
    tokenAddress,
    balanceOfABI,
    providers[network] as ethers.JsonRpcProvider
  );
  const balance = await c.balanceOf(address);
  return balance;
}
