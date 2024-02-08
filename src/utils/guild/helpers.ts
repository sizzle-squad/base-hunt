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
  let mst5pm = new Date();
  mst5pm.setUTCHours(24, 0, 0, 0); //5pm MST

  // Check if current time is before or after 5pm MST today
  if (now < mst5pm) {
    //get the previous day range
    console.log('get previous day');
    from = new Date();
    from.setUTCDate(from.getUTCDate() - 1); //yesterday
    from.setUTCHours(24, 0, 0, 0); //5pm MST
    to = mst5pm;
  } else {
    console.log('get next day');
    //get the next day range
    to = new Date();
    to.setUTCDate(to.getUTCDate() + 1); //tomorrow
    to.setUTCHours(24, 0, 0, 0); //5pm MST
    from = mst5pm;
  }
  return [from, to];
}
