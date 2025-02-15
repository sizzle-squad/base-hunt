type Props = {
  address: `0x${string}` | undefined;
  gameId: string;
  id: string; // guildId
};

export function getReferralLink({ address, gameId, id }: Props) {
  if (typeof window === 'undefined') return;

  return (
    `https://warpcast.com/~/compose?embeds[]=` +
    encodeURIComponent(
      `https://basehunt.xyz/frames/join?userAddress=${address}&gameId=${gameId}&guildId=${id}`
    )
  );
}
