import { Network, Alchemy } from "alchemy-sdk";

const alchemySettings = {
    apiKey: process.env.ALCHEMY_ID,
    network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(alchemySettings);

class EtherScan {
    constructor(settings) {
        this.apiKey = settings.apiKey;
        this.domain = settings.domain;
    }
    
    async fetch(action, params = { startblock: 0, endblock: 99999999, sort: 'desc' }) {
        try {
            let url = `https://api.${this.domain}/api?module=account&action=${action}&apikey=${this.apiKey}`;
            for (const [key, value] of Object.entries(params)) {
                url += value ? `&${key}=${value}` : '';
            }
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async getExternalTransfers(params) {
        // params = { address, page, offset, startblock, endblock, sort }
        return await this.fetch('txlist', params);
    }

    async getERC20Transfers(params) {
        // params = { address, contractAddress, page, offset, startblock, endblock, sort }
        return await this.fetch('tokentx', params);
    }

    async getAssetTransfers(params) {
        // params = { address, contractAddress, page, offset, startblock, endblock, sort, categories }
        const { categories } = params;
        let transfers = [];
        for (const category of categories) {
            if (category === 'external') {
                const externalTransfers = await etherScan.getExternalTransfers(params);
                transfers = [...transfers, externalTransfers];
            } else if (category === 'erc20') {
                const erc20Transfers = await etherScan.getERC20Transfers(params);
                transfers = [...transfers, erc20Transfers];
            }
        }
        return transfers;
    }
}

const etherScanSettings = {
    apiKey: process.env.ETHERSCAN_API_KEY,
    domain: 'basescan.org',
};

const etherScan = new EtherScan(etherScanSettings);

// export async function ownsNFT(userAddress, contract) {
//     const response = await alchemy.nft.verifyNftOwnership(userAddress, contract);
//     return response;
// }

// export async function hasUSDC(userAddress) {
//     const bridgedUSDC = "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA";
//     const nativeUSDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
//     const contracts = [bridgedUSDC, nativeUSDC];

//     const tokenBalanceRes = await alchemy.core.getTokenBalances(userAddress, contracts);
//     const filterByBalance = tokenBalanceRes.tokenBalances.filter((balance) => Number(balance.tokenBalance) > 0);
//     return filterByBalance.length > 0;
// }

export async function ownsNFT(userAddress, contract) {
    const response = await alchemy.nft.verifyNftOwnership(userAddress, contract);
    return response;
}

export async function hasToken(userAddress, contract) {
    const contracts = [contract];
    const tokenBalanceRes = await alchemy.core.getTokenBalances(userAddress, contracts);
    const filterByBalance = tokenBalanceRes.tokenBalances.filter((balance) => Number(balance.tokenBalance) > 0);
    return filterByBalance.length > 0;
}

export async function verifyTransactions(toAddress, fromAddress, contractAddress) {
    const params = {
        address: fromAddress,
        contractAddress,
        categories: ['external', 'erc20']
    }
    const response = await etherScan.getAssetTransfers(params);
    return response;
}

const userAddress = "0x95e32bA428421a24D77DDCc882696330161963B2";
// const contract = "0x874ad7c13935f73c7bbe94efbd8e766de2a585eb";
// const otherContract = "0xf0d0df7142f60f7f3847463a509fd8969e3e3a27";
// const contracts = [contract, otherContract];

const res = await verifyTransactions('', userAddress, "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");
// const res = await ownsNFT(userAddress, contract);
console.log(JSON.stringify(res, null, 4));

// const usdcHolderAddress = "0x3691c32dc1bbe08233d20a9e2a2f2d74d762dc51";
// const res = await hasUSDC(usdcHolderAddress);
// console.log(res);