'use client';

import {
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import Image from 'next/image';
import Text from '@/components/Text';
import { LevelBadgesRow } from '@/components/assets/icons/LevelBadgesRow';
import { BaseHuntHero } from '@/components/assets/BaseHuntHero';
import { Color } from '@/constants/color';
import { useGameInfoContext } from '@/context/GameInfoContext';

export default function Thanks() {
  const theme = useTheme();
  const smallerThanSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { showModal, setShowModal } = useGameInfoContext();

  return (
    <Stack
      direction="column"
      justifyContent={'center'}
      sx={{
        position: 'absolute',
        p: '20px',
        width: '100%',
        height: '100vh',
        backgroundColor: 'black',
      }}
      gap="4rem"
    >
      <Stack width="100%" justifyContent="center" alignItems="center" gap={4}>
        <LevelBadgesRow />
        <BaseHuntHero />
        <Stack pt={3} gap={3}>
          <Text
            variant="body1"
            fontWeight={500}
            lineHeight="16.8px"
            textAlign="center"
            color={Color.White}
          >
            ETHDENVER Feb 26 - Mar 3
          </Text>
          <Text variant="h5" textAlign="center" color={Color.White}>
            Play onchain and unlock prizes.
          </Text>
          <Text variant="body2" textAlign="center" color={Color.White}>
            Base Hunt spans 7 days and ends March 3rd at 5 PM MST.
          </Text>
        </Stack>
      </Stack>
      <Stack
        direction="column"
        alignItems="center"
        width="100%"
        justifyContent="center"
        gap={2}
      >
        <Text align="center" color={Color.White}>
          Trust us, use Coinbase Wallet if you want to win.
        </Text>
        <Stack
          direction={smallerThanSm ? 'column' : 'row'}
          alignItems="center"
          justifyContent="center"
          gap={2}
          width={'100%'}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              py: '20px',
              px: 3,
              fontSize: '16px',
              backgroundColor: Color.White,
              width: ['80%', '250px'],
              borderRadius: '12px',
              fontFamily: 'CoinbaseMono',
              fontWeight: 400,
              color: Color.Black,
            }}
            onClick={() => setShowModal(true)}
          >
            <Image
              src="/images/coinbase-wallet-logo.png"
              alt="Coinbase Wallet Logo"
              height={24}
              width={24}
            />
            <Typography pl={2} fontSize={14} textTransform="uppercase">
              Get Coinbase Wallet
            </Typography>
          </Button>
          <Stack alignItems="center" width={['80%', '250px']}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                py: '20px',
                px: 3,
                fontSize: '14px',
                backgroundColor: Color.CoinbaseBlue,
                width: '100%',
                borderRadius: '12px',
                fontFamily: 'CoinbaseMono',
                fontWeight: 400,
                color: Color.White,
              }}
            >
              Basehunt is coming...
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
