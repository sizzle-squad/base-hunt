import { Card, Stack } from '@mui/material';

import { useCallback, useMemo } from 'react';
import Text from '@/components/Text';
import { Button } from '@/components/assets/Button';
import { Color } from '@/constants/color';

type Props = {
  address: `0x${string}` | undefined;
  gameId: string;
  id: string; // guildId
};

export function Referral({ address, gameId, id }: Props) {
  const referralLink = useMemo(() => {
    return (
      `https://warpcast.com/~/compose?embeds[]=` +
      encodeURIComponent(
        `https://basehunt.xyz/frames/join?userAddress=${address}&gameId=${gameId}&guildId=${id}`
      )
    );
  }, [address, gameId, id]);

  const handlePress = useCallback(
    (ctaUrl: string) => () => {
      window.open(referralLink, '_blank');
    },
    [referralLink]
  );

  return (
    <Card
      sx={{
        height: '100%',
        p: 2,
        borderRadius: '8px',
        cursor: 'pointer',
      }}
    >
      <Stack direction="column" gap={2}>
        <Text variant="h5">Base Hunt is better as a team</Text>
        <Text fontStyle="italic" variant="body2">
          Earn 10 points per referral
        </Text>
        <Button
          variant="outlined"
          textColor="black"
          width="100%"
          px="12px"
          py="8px"
          onClick={handlePress(referralLink)}
        >
          <Text color={Color.White}>Recruit your friends</Text>
        </Button>
      </Stack>
    </Card>
  );
}
