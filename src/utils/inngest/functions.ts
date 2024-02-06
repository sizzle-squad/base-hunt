import { inngest } from './client';
import { Database } from '../database.types';
import { PostgrestError, createClient } from '@supabase/supabase-js';
import {
  ChallengeStatus,
  ChallengeType,
  CheckFunctionType,
  Networks,
} from '../database.enums';
import { providers } from '../ethereum';
import { ethers } from 'ethers';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

const BatchSize = parseInt(process.env.BATCH_SIZE as string) || 50;
const queryBatchSize = 1000;
export const userTxCount = inngest.createFunction(
  { id: 'user-tx-count' },
  { event: 'events/user-tx-count' },
  async ({ event, step }) => {
    const users: { user_address: string; guild_id: string }[] = [];
    let uRange: string[] = [];
    let iter: number = 0;
    while (true && iter < 20) {
      const uRange = await step.run('fetch guild users', async () => {
        const { data, error } = await supabase
          .from('guild_member_configuration')
          .select('user_address,guild_id')
          .eq('game_id', event.data.gameId as number)
          .range(iter * queryBatchSize, (iter + 1) * queryBatchSize - 1);
        if (error) {
          return [];
        }
        return data;
      });
      users.push(...uRange);
      if (uRange.length < queryBatchSize) {
        break;
      }
      iter++;
    }
    let chunks = chunkArray(users, BatchSize);

    let txCounts: any[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const t = await step.run('get-tx-count', async () => {
        const p = providers[Networks.networks_base_mainnet];
        const reqs = chunks[i].map((u, idx) => {
          return {
            id: idx,
            jsonrpc: '2.0',
            method: 'eth_getTransactionCount',
            params: [u.user_address, 'latest'],
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

    const z = await step.run('update-user-score', async () => {
      const zipped = users.map((u, i) => {
        return {
          user_address: u.user_address,
          tx_count: flatten[i],
          network: Networks.networks_base_mainnet,
        };
      });

      const { data, error } = await supabase
        .from('user_txcount')
        .upsert(zipped, { onConflict: 'user_address,network' })
        .select();
      if (error) {
        console.error(error);
      }
      //Note: we have to remap here becuase upsert complains if we include guildId
      return zipped.map((z, i) => {
        return { ...z, guild_id: users[i].guild_id };
      });
    });

    let reduced = await step.run('reduce-tx-count', () => {
      return z.reduce(
        (acc, item) => {
          if (!acc[item.guild_id]) {
            acc[item.guild_id] = 0;
          }
          acc[item.guild_id] += item.tx_count;
          return acc;
        },
        {} as { [guild_id: string]: number }
      );
    });

    const dbData = await step.run('update-guild-score', async () => {
      const gs = Object.keys(reduced).map((k) => {
        return {
          guild_id: k,
          score: reduced[k],
          game_id: event.data.gameId as number,
          updated_at: new Date().toISOString(),
        };
      });
      const { data, error } = await supabase
        .from('guild_score')
        .upsert(gs, { onConflict: 'game_id,guild_id' })
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

export const userPointDistribute = inngest.createFunction(
  { id: 'user-point-distribute' },
  { event: 'events/user-point-distribute' },
  async ({ event, step }) => {
    // Get current date in MST
    let now = new Date();
    let mstNow = now.toLocaleString('en-US', { timeZone: 'America/Denver' });

    // Get start of day in MST
    let start = new Date(mstNow);
    start.setHours(0, 0, 0, 0);
    let mstStart = start.toLocaleString('en-US', {
      timeZone: 'America/Denver',
    });

    // Get end of day in MST
    let end = new Date(mstNow);
    end.setHours(23, 59, 59, 999);
    let mstEnd = end.toLocaleString('en-US', { timeZone: 'America/Denver' });

    const challengeData = await supabase
      .from('challenge_configuration')
      .select()
      .eq('type', ChallengeType.GUILD)
      .eq('function_type', CheckFunctionType.checkTxCountBatch)

      .single();

    if (challengeData.error) {
      console.error(challengeData.error);
      return;
    }

    const challenge = challengeData.data;

    const guildId: string | null = await step.run(
      'fetch-guild-with-highest-score',
      async () => {
        const { data, error } = await supabase
          .from('guild_score')
          .select('guild_id')
          .eq('game_id', event.data.gameId as number)
          .order('score', { ascending: false })
          .limit(1);
        if (error) {
          console.error(error);
          return null;
        }

        return data[0].guild_id;
      }
    );

    if (guildId === null) {
      console.error('No guild found with highest score');
      return;
    }

    const users = await step.run('fetch-guild-users', async () => {
      const { data, error } = await supabase
        .from('guild_member_configuration')
        .select('user_address')
        .eq('game_id', event.data.gameId as number)
        .eq('guild_id', guildId as string);
      if (error) {
        console.error(error);
        return [];
      }
      return data;
    });

    const rows = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const row = await step.run('update-challenge', async () => {
        const d = {
          user_address: user.user_address,
          challenge_id: challenge.id,
          status: ChallengeStatus.COMPLETE,
          points: challenge.points as number,
        };
        // TODO: uncomment this
        // await supabase
        //   .from('user_challenge_status')
        //   .insert(d)
        //   .select();
        return d;
      });

      await step.sleep('wait-a-moment', '10 milliseconds');
      rows.push(row);
    }

    return { data: rows };
  }
);
