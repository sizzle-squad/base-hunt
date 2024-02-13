import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata, ResolvingMetadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { toBigInt } from '@/utils/toBigInt';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string };
};

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  console.log('generating metadata:', searchParams);
  const userAddress = searchParams['userAddress'] as string;
  const gameId = toBigInt(searchParams['gameId'] as string);
  if (!userAddress || gameId === null) {
    console.log('no user address or gameId');
  }
  console.log('generating metadata:', userAddress, gameId);
  //get user guild
  const userGuildData = await supabase
    .from('guild_member_configuration')
    .select('*')
    .eq('game_id', gameId)
    .eq('user_address', userAddress.toLocaleLowerCase())
    .maybeSingle();
  if (userGuildData.error) {
    console.error(userGuildData.error);
  }

  const guildData = await supabase
    .from('guild_configuration')
    .select('*')
    .eq('game_id', gameId)
    .eq('guild_id', userGuildData.data.guild_id)
    .single();
  if (guildData.error) {
    console.error(guildData.error);
  }
  let guild = guildData.data;

  console.log(guild);
  const frameMetadata = await getFrameMetadata({
    buttons: [
      {
        label: `Join ${guild.name}`,
      },
    ],
    image: 'https://i.ibb.co/dtbDRxb/img.gif',
    postUrl: `https://base-hunt-eth-denver-2024.vercel.app/api/frames/join?userAddress=${userAddress}&gameId=${gameId}&guildId=${guild.guild_id}`,
  });

  const _metadata: Metadata = {
    title: 'Base Hunt Guilds',
    description: 'Join a guild and start hunting!',
    openGraph: {
      title: 'Base Hunt Guilds',
      description: 'Join a guild and start hunting!',
      images: ['https://i.ibb.co/dtbDRxb/img.gif'],
    },
    other: {
      ...frameMetadata,
    },
  };
  return _metadata;
}

export default function Page({ params, searchParams }: Props) {
  console.log(searchParams);

  return (
    <>
      <h1>Welcome to Base Hunt</h1>
    </>
  );
}

export const dynamic = 'force-dynamic';
