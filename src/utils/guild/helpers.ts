export type GuildScoreData = { id: number; guild_id: string; score: number };

export async function getGuildTxCounts(
  data: GuildScoreData[]
): Promise<Record<string, number>> {
  // Group items by guild_id
  const grouped = data.reduce(
    (acc: Record<string, GuildScoreData[]>, item: GuildScoreData) => {
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
  return scoreDifferences;
}

export async function get5pmMstDateRangeFromCurrent(
  now: Date
): Promise<[Date, Date]> {
  let from, to;
  from = new Date(
    `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${
      now.getUTCDate() - 1
    } 24:00:00.000Z`
  ); //5pm MST from yesterday
  to = now;
  console.log(from, to);

  return [from, to];
}
