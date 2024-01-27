import axios from 'axios';
import { ethers } from 'ethers';
import { headers } from 'next/dist/client/components/headers';

const KEY = process.env.GITCOIN_PASSPORT_KEY;
const SCORER_ID = process.env.GITCOIN_PASSPORT_SCORER_ID;

export type CheckUserScoreGitcoinPassportScoreParams = {
  userAddress: string;
  gte: number;
};

export interface GitCoinResponse {
  address: string;
  score: string;
  status: string;
  last_score_timestamp: string;
  evidence: any;
  error: any;
}

export async function checkUserGitcoinPassportScore(
  params: CheckUserScoreGitcoinPassportScoreParams,
  provider: ethers.JsonRpcProvider
): Promise<boolean> {
  //   const r = await axios.post(
  //     'https://api.scorer.gitcoin.co/registry/submit-passport',
  //     {
  //       address: params.userAddress,
  //       scorer_id: SCORER_ID,
  //     },
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-API-KEY': KEY,
  //       },
  //     }
  //   );

  const r = await axios.get<any, GitCoinResponse>(
    `https://api.scorer.gitcoin.co/registry/score/${SCORER_ID}/${params.userAddress}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': KEY,
      },
    }
  );
  if (r.error) {
    console.log(`Gitcoin Passport Error: ${r.error}`);
    return false;
  }
  return parseFloat(r.score) >= params.gte;
}
