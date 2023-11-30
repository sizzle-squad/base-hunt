import { Stack } from '@mui/material';
import Image from 'next/image';
import Text from '@/components/Text';

type Props = {
  owned: boolean;
};

function OwnershipPill({ owned = false }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        py: 1,
        px: 2,
        mt: 6,
        borderRadius: 20,
        background: owned
          ? 'rgba(255, 255, 255, 0.20)'
          : 'rgba(29, 24, 24, 0.20);',
        gap: 1,
      }}
    >
      <Image
        src={owned ? '/images/icon-confetti.png' : '/images/icon-signpost.png'}
        alt="Coinbase Wallet Logo"
        height={24}
        width={24}
      />
      <Text
        fontSize={14}
        sx={{
          color: owned ? '#FFFFFF' : '#1D1818',
        }}
      >
        {owned ? 'You own this!' : 'Not yet found'}
      </Text>
    </Stack>
  );
}

export default OwnershipPill;
