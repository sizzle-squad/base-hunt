import LeaderboardClient from '../LeaderboardClient';

export async function generateMetadata() {
  return {
    title: 'Base Hunt - Guilds',
    description: 'Play Base Hunt - Guilds',
    openGraph: {
      title: 'Base Hunt - Guilds',
      description: 'Play Base Hunt - Guilds',
      // images: [activeBadge?.image_url, ...previousImages],
      type: 'website',
      siteName: 'Warpcast',
    },
    warpcast: {
      title: 'Base Hunt - Guilds',
      description: 'Play Base Hunt - Guilds',
      site: '@CoinbaseWallet',
      creator: '@CoinbaseWallet',
      // images: [activeBadge?.image_url],
      card: 'summary_large_image',
    },
    themeColor: '#1ca0f2',
  };
}

export default function Page() {
  return <LeaderboardClient selectedBoard="guilds" />;
}
