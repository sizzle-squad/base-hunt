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
import {
  GuildScoreData,
  get5pmMstDateRangeFromCurrent,
  getGuildTxCounts,
} from '../guild/helpers';

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
          user_address: u.user_address.toLowerCase(),
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

/*
  The event should have 3 fields with example:

  scheduleAt: '2024-02-20 17:00:00.000-07',//Run at 5pm MST on 20th Feb 2024
  from: '2024-02-19 17:00:00.000-07',// 5pm MST on 19th Feb 2024
  to: '2024-02-20 17:00:00.000-07',// 5pm MST on 20th Feb 2024
  claimId: 1 // int representing this run 
  This will find which guild did the most activity between the from and to dates and distribute points to the users in that guild
*/
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
    let from: Date, to: Date, claimId: number;
    if (event.data.from && event.data.to && event.data.claimId) {
      from = new Date(event.data.from);
      to = new Date(event.data.to);
      claimId = event.data.claimId;
    } else {
      [from, to] = await get5pmMstDateRangeFromCurrent(new Date());
      claimId = to.getDate();
    }
    const guildId: string | null = await step.run(
      'fetch-guild-with-highest-score',
      async () => {
        const { data, error } = await supabase
          .from('guild_score')
          .select('id,guild_id,score')
          .eq('game_id', event.data.gameId as number)
          .gte('timestamp', from.toISOString())
          .lte('timestamp', to.toISOString())
          .returns<GuildScoreData[]>();

        if (error) {
          console.error(error);
          return null;
        }

        if (data.length === 0) {
          return null;
        }

        const scoreDifferences = await getGuildTxCounts(data);

        // Find the guild_id with the highest score difference
        const sortedScoreDifferences = Object.entries(scoreDifferences).sort(
          (a, b) => b[1] - a[1]
        );

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
      const rowChunks = await step.run('update-challenge', async () => {
        const rows = chunks[i].map((u) => {
          return {
            user_address: u.user_address.toLowerCase(),
            points: challenge.points as number,
            game_id: event.data.gameId as number,
            guild_id: guildId,
            claim_id: event.data.claimId,
            is_claimed: false,
          };
        });

        //insert all claims
        const ugscData = await supabase
          .from('user_guild_score_claim')
          .upsert(rows, {
            onConflict: 'game_id,user_address,guild_id,claim_id',
            ignoreDuplicates: true,
          })
          .select();
        if (ugscData.error) {
          console.error(ugscData.error);
          return [];
        }
        return ugscData.data;
      });

      await step.sleep('wait-a-moment', '2000 milliseconds');
      rows.push(rowChunks);
    }

    return { data: rows };
  }
);
