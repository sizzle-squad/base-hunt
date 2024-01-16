import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import '@/utils/helper';
import { Network, Alchemy } from "alchemy-sdk";
import { toBigInt } from '@/utils/toBigInt';
import { BoostTypeEnum } from '@/hooks/types';

class Blockscout {
  apiKey: string | undefined;
  domain: string;
  network: string;

  constructor(settings: { apiKey: string | undefined; domain: string; network: string; }) {
      this.apiKey = settings.apiKey;
      this.domain = settings.domain;
      this.network = settings.network;
  }

  async fetch(action: string, params = { startblock: 0, endblock: 99999999, sort: 'desc' }) {
      try {
          let url = `https://${this.network}.${this.domain}/api?module=account&action=${action}&apikey=${this.apiKey}`;
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

  async getExternalTransfers(params: { startblock: number; endblock: number; sort: string; } | undefined) {
      return await this.fetch('txlist', params);
  }

  async getERC20Transfers(params: { startblock: number; endblock: number; sort: string; } | undefined) {
      return await this.fetch('tokentx', params);
  }

  async getAssetTransfers(params: { categories: string[]; startblock: number; endblock: number; sort: string; }) {
      const { categories } = params;
      let transfers: any[] = [];
      for (const category of categories) {
          if (category === 'external') {
              const externalTransfers = await this.getExternalTransfers(params);
              transfers = [...transfers, ...externalTransfers.result];
          } else if (category === 'erc20') {
              const erc20Transfers = await this.getERC20Transfers(params);
              transfers = [...transfers, ...erc20Transfers.result];
          }
      }
      return transfers;
  }
}

const blockscoutSettings = {
  apiKey: process.env.BLOCKSCOUT_API_KEY,
  domain: 'blockscout.com',
  network: 'base',
};

const blockscout = new Blockscout(blockscoutSettings);

const settings = {
  apiKey: process.env.ALCHEMY_ID,
  network: Network.BASE_MAINNET,
};

const alchemy = new Alchemy(settings);

async function verifyNftOwnership(userAddress: string, contracts: string[]) {
    const response = await alchemy.nft.verifyNftOwnership(userAddress, contracts);
    return response;
}

async function hasToken(userAddress: string, contract: string, threshold: number) {
    const tokenBalanceRes = await alchemy.core.getTokenBalances(userAddress, [contract]);
    const metadata = await alchemy.core.getTokenMetadata(contract);
    const filterByBalance = tokenBalanceRes.tokenBalances
        .filter((balance) => (Number(balance.tokenBalance)/Math.pow(10, metadata.decimals as number)) >= threshold);
    return filterByBalance.length > 0;
}

async function verifyTransactions(toAddress: string, fromAddress: string, contractAddress: string) {
  const params = {
      address: fromAddress,
      contractAddress,
      categories: ['external', 'erc20'],
  }
  const response = await blockscout.getAssetTransfers(params as any);
  const transfers =  response.filter((transfer) => transfer.to.toLowerCase() === toAddress.toLowerCase());
  return transfers.length > 0;
}

const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
);

export type BoostsClaimRequest = {
  gameId: string;
  userAddress: string;
  boostId: string;
  contractAddresses: string[];
};

export async function POST(request: NextRequest) {
  const body: BoostsClaimRequest = await request.json();

  const { gameId, userAddress, boostId, contractAddresses } = body;

  if (!userAddress || !gameId || !boostId) {
    return new Response(
      `Missing parameters: userAddress: ${userAddress}, gameId: ${gameId}, boostId: ${boostId}`,
      {
        status: 400,
      }
    );
  }

  const gameIdInBigInt = toBigInt(gameId as string);
  const boostIdInBigInt = toBigInt(boostId as string);

  const now = new Date().toISOString();

  const boostData = await supabase
  .from('boost_configuration')
  .select(`
    *,
    claimed_boost (
      boost_id,
      updated_at
    )
  `)
  .eq('id', boostIdInBigInt)
  .eq('game_id', gameIdInBigInt)
  .eq('is_enabled', true)
  .or(`available_time.is.null,available_time.lte.${now}`)
  .single();

  if (boostData.error) {
    console.error(boostData.error);
    return new Response(`Unable to claim boost for boostId: ${boostId}, gameId: ${gameId}.`, { status: 400 });
  }

  const boost = boostData.data;

  if (!boost) {
    return new Response(`No available boost ${boostId} found for gameId: ${gameId}`, {
        status: 400,
      });
  }

  let contractAddress;
  if (boost.boost_type === BoostTypeEnum.NFT ||
      boost.boost_type === BoostTypeEnum.NFT_PER_MINT ||
      boost.boost_type === BoostTypeEnum.TOKEN ||
      boost.boost_type === BoostTypeEnum.TRANSACTION) {
    if (!contractAddresses || contractAddresses.length < 1) {
      return new Response(
        `Missing parameters: contractAddress: ${JSON.stringify(contractAddresses)} for boost type ${boost.boost_type}`,
        {
          status: 400,
        }
      );
    } else {
      contractAddress = contractAddresses[0];
    }
  }

  let verified = false;
  switch (boost.boost_type) {
    case BoostTypeEnum.NFT:
    case BoostTypeEnum.NFT_PER_MINT:
        const response = await verifyNftOwnership(userAddress, contractAddresses);
        let verifiedContractAddress = null;
        for (let key in response) {
          if (response.hasOwnProperty(key) && response[key] === true) {
            verifiedContractAddress = key;
            break;
          }
        }
        verified = verifiedContractAddress !== null;
        contractAddress = verifiedContractAddress;
        break;
    case BoostTypeEnum.TOKEN:
        verified = await hasToken(userAddress, contractAddress!, boost.transaction_value_threshold);
        break;
    case BoostTypeEnum.TRANSACTION:
        verified = await verifyTransactions(boost.transaction_to, userAddress, contractAddress!);
        break;
    case BoostTypeEnum.DEFAULT:
        verified = true;
        break;
  }

  if (!verified) return new Response(`Unable to claim boost for boostId: ${boostId}, gameId: ${gameId}.`, { status: 400 });
  const { data: claimedBoost, error } = await supabase
  .from('claimed_boost')
  .insert([{
    user_address: userAddress.toLowerCase(),
    boost_id: boost.id,
    game_id: gameIdInBigInt,
    contract_address: contractAddress ? contractAddress.toLowerCase() : null
  }])
  .single();

  if (error) {
    return new Response(`Unable to claim boost for boostId: ${boostId}, gameId: ${gameId}.`, { status: 400 });
  }

  return NextResponse.json({ claimedBoost, status: 'ok' });
}
