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
const queryBatchSize = 1000;
export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    const users: string[] = [];
    let uRange: string[] = [];
    let iter: number = 0;
    while (true && iter < 20) {
      const uRange = await step.run('fetch guild users', async () => {
        const { data, error } = await supabase
          .from('guild_member_configuration')
          .select('user_address')
          .eq('guild_id', event.data.guildId as string)
          .eq('game_id', event.data.gameId as number)
          .range(iter * queryBatchSize, (iter + 1) * queryBatchSize - 1);
        if (error) {
          return [];
        }
        return data.map((u) => u.user_address);
      });
      users.push(...uRange);
      if (uRange.length < queryBatchSize) {
        break;
      }
      iter++;
    }
    // console.log('users:', users.length);
    //await step.sleep('wait-a-moment', '1 second');
    let chunks = chunkArray(users, BatchSize);

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

    let flatten: number[] = await step.run('flatten-tx-count', () => {
      return txCounts
        .reduce((accumulator, value) => accumulator.concat(value), [])
        .map((r: any) => r.result)
        .map((r: any) => {
          try {
            return ethers.toNumber(r);
          } catch (e) {
            return ethers.toNumber(0);
          }
        });
    });

    flatten = await step.run('update-user-score', async () => {
      let upserts = users.map((u, i) => {
        return {
          user_address: u,
          tx_count: flatten[i],
          network: Networks.networks_base_mainnet,
        };
      });

      const { data, error } = await supabase
        .from('user_txcount')
        .upsert(upserts, { onConflict: 'user_address,network' })
        .select();
      return flatten;
    });

    let reduced = await step.run('reduce-tx-count', () => {
      return flatten.reduce((a, b) => a + b, 0);
    });

    const dbData = await step.run('update-guild-score', async () => {
      const { data, error } = await supabase
        .from('guild_score')
        .upsert(
          {
            updated_at: new Date().toISOString(),
            guild_id: event.data.guildId as string,
            game_id: event.data.gameId as number,
            score: reduced,
          },
          { onConflict: 'game_id,guild_id' }
        )
        .eq('guild_id', event.data.guildId as string)
        .eq('game_id', event.data.gameId as number)
        .select();

      if (error) {
        return { error: error };
      }
      return { data: data };
    });
    //TODO: update guild score table
    return { data: dbData };
  }
);

function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
    array.slice(i * size, i * size + size)
  );
}
