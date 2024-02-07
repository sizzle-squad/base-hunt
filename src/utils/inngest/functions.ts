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
      const executionTime = new Date().toISOString();
      const gs = Object.keys(reduced).map((k) => {
        return {
          guild_id: k,
          score: reduced[k],
          game_id: event.data.gameId as number,
          timestamp: executionTime,
        };
      });
      const { data, error } = await supabase
        .from('guild_score')
        .insert(gs)
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
    //NOTE: the time passed in should be iso 8601 compatible string
    const at = new Date(event.data.scheduleAt);

    await step.sleepUntil('wait-for-scheduled', at);

    let now = new Date();
    const challengeData = await supabase
      .from('challenge_configuration')
      .select()
      .eq('game_id', event.data.gameId as number)
      .eq('type', ChallengeType.GUILD)
      .eq('function_type', CheckFunctionType.checkTxCountBatch)
      .lte('start_timestamp', now.toISOString())
      .gt('end_timestamp', now.toISOString())
      .eq('is_enabled', true)
      .single();

    if (challengeData.error) {
      console.error(challengeData.error);
      return { error: challengeData.error };
    }

    const challenge = challengeData.data;
    const time = new Date();

    const guildId: string | null = await step.run(
      'fetch-guild-with-highest-score',
      async () => {
        const { data, error } = await supabase
          .from('guild_score')
          .select('id,guild_id,score')
          .eq('game_id', event.data.gameId as number)
          .gte('timestamp', event.data.from as string)
          .lte('timestamp', event.data.to as string)
          .returns<{ id: number; guild_id: string; score: number }[]>();

        if (error) {
          console.error(error);
          return null;
        }

        if (data.length === 0) {
          return null;
        }

        // Group items by guild_id
        const grouped = data.reduce(
          (
            acc: Record<
              string,
              { id: number; guild_id: string; score: number }[]
            >,
            item: { id: number; guild_id: string; score: number }
          ) => {
            if (!acc[item.guild_id]) {
              acc[item.guild_id] = [];
            }
            acc[item.guild_id].push(item);
            return acc;
          },
          {}
        );

        // Sort each group by id and calculate score difference
        const scoreDifferences: Record<string, number> = {};
        for (const guild_id in grouped) {
          const sorted = grouped[guild_id].sort((a, b) => a.id - b.id);
          const first = sorted[0];
          const last = sorted[sorted.length - 1];
          scoreDifferences[guild_id] = last.score - first.score;
        }

        // Find the guild_id with the highest score difference
        const sortedScoreDifferences = Object.entries(scoreDifferences).sort(
          (a, b) => b[1] - a[1]
        );

        console.log(sortedScoreDifferences);
        return sortedScoreDifferences.length > 0
          ? sortedScoreDifferences[0][0]
          : null;
      }
    );

    if (guildId === null) {
      const message = `No guild found with highest score gameId:${event.data.gameId}`;
      console.error(message);
      return { error: message };
    }

    const users: { user_address: string }[] = [];
    let uRange: string[] = [];
    let iter: number = 0;
    while (true && iter < 20) {
      const uRange = await step.run('fetch guild users', async () => {
        const { data, error } = await supabase
          .from('guild_member_configuration')
          .select('user_address')
          .eq('game_id', event.data.gameId as number)
          .eq('guild_id', guildId)
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

    //NOTE: we only want to insert 10 scores every second so we dont blow up airdrops for users crossing levels
    let chunks = chunkArray(users, queryBatchSize);
    const rows = [];
    for (let i = 0; i < chunks.length; i++) {
      const row = await step.run('update-challenge', async () => {
        return chunks[i].map((u) => {
          return {
            user_address: u.user_address,
            challenge_id: challenge.id,
            status: ChallengeStatus.IN_PROGRESS,
            points: challenge.points as number,
          };
        });
        // TODO: uncomment this
        // await supabase
        //   .from('user_challenge_status')
        //   .insert(d)
        //   .select();
      });

      await step.sleep('wait-a-moment', '2000 milliseconds');
      rows.push(row);
    }

    return { data: rows };
  }
);
