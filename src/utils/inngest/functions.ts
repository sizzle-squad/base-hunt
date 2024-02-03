import axios from 'axios';
import { inngest } from './client';
import { Database } from '../database.types';
import { createClient } from '@supabase/supabase-js';
import { getTxCountBatch } from '../claims/txHistoryCheck';
import { Networks } from '../database.enums';
import { providers } from '../ethereum';
import { ethers } from 'ethers';
import { get } from 'http';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

const BatchSize = parseInt(process.env.BATCH_SIZE as string) || 50;

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    const users = await step.run('fetch guild users', async () => {
      const { data, error } = await supabase
        .from('guild_member_configuration')
        .select('user_address')
        .eq('guild_id', event.data.guildId as string)
        .eq('game_id', event.data.gameId as number);
      if (error) {
        return [];
      }
      return data.map((u) => u.user_address);
    });
    console.log('users:', users);
    //await step.sleep('wait-a-moment', '1 second');
    let chunks = chunkArray(users, BatchSize);

    // const c = await step.run('get-count-chunk', async () => {
    //   const p = providers[Networks.networks_base_mainnet];
    //   const counts = await Promise.all(
    //     chunks.map(async (chunk) => {
    //       const sum = await getTxCountBatch(chunk, p);
    //       return sum;
    //     })
    //   );
    //   const sum = counts.reduce((a, b) => a + b, ethers.toBigInt(0));
    //   console.log(sum);
    //   return sum;
    // });
    let txCounts: any[] = [];
    for (var i = 0; i < chunks.length; i++) {
      const t = await step.run('get-tx-count', async () => {
        const p = providers[Networks.networks_base_mainnet];
        const reqs = chunks[i].map((a, idx) => {
          return {
            id: idx,
            jsonrpc: '2.0',
            method: 'eth_getTransactionCount',
            params: [a, 'latest'],
          };
        }) as Array<{
          id: number;
          jsonrpc: '2.0';
          method: string;
          params: Array<any>;
        }>;
        return await p._send(reqs);
      });
      await step.sleep('wait-a-moment', '1 seconds');
      txCounts.push(t);
    }

    const flatten = await step.run('reduce-tx-count', () => {
      return txCounts
        .reduce((accumulator, value) => accumulator.concat(value), [])
        .map((r: any) => r.result)
        .map((r: any) => {
          try {
            return ethers.toNumber(r);
          } catch (e) {
            return ethers.toNumber(0);
          }
        })
        .reduce((a: any, b: any) => a + b, 0);
    });

    //TODO: update guild score table
    return { data: flatten };
  }
);

function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
    array.slice(i * size, i * size + size)
  );
}
