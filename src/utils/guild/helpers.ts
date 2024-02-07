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
  let from, to, fromString, toString;
  // Convert to MST
  let mstNowString = now.toLocaleString('en-US', {
    timeZone: 'America/Denver',
  });

  // Create new Date object with MST date string
  let mstNow = new Date(mstNowString);
  // Create a new date for 5pm MST
  let mst5pm = new Date(mstNow);
  mst5pm.setHours(17, 0, 0, 0); // 5pm

  // Check if current time is before or after 5pm MST
  if (mstNow < mst5pm) {
    //get the previous day range
    from = new Date(mst5pm);
    from.setDate(from.getDate() - 1);

    to = mst5pm;
  } else {
    //get the next day range
    to = new Date(mst5pm);
    to.setDate(to.getDate() + 1);
    from = mst5pm;
  }
  return [from, to];
}
