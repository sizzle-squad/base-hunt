import { createClient } from '@supabase/supabase-js';
import type { Metadata, ResolvingMetadata } from 'next';
import BadgeClient from './badgeClient';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_ANON_KEY as string
  );
  const gameId = 0;
  // read route params
  const id = params.id;

  // fetch data
  const { data, error } = await supabase
    .from('badge_configuration')
    .select(
      'description, artist_name, lat_lng, type, game_id, image_url, token_id, contract_address, name, id'
    )
    .eq('game_id', gameId);

  if (error) {
    throw error;
  }

  const idNumber = parseInt(id);
  const activeBadge = data.find((badge) => badge.id === idNumber);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: activeBadge?.name,
    description: activeBadge?.description,
    openGraph: {
      title: activeBadge?.name,
      description: activeBadge?.description,
      images: [activeBadge?.image_url, ...previousImages],
      type: 'website',
      siteName: 'Twitter',
    },
    twitter: {
      title: activeBadge?.name,
      site: '@CoinbaseWallet',
      description: activeBadge?.description,
      creator: '@CoinbaseWallet',
      images: [activeBadge?.image_url],
      card: 'summary_large_image',
    },
    themeColor: '#1ca0f2',
    alternates: {
      canonical: `https://twitter.com/${username}/status/${id}`,
    },
  };
}

export default async function BadgeDetails({ params, searchParams }: Props) {
  return <BadgeClient params={params} />;
}
