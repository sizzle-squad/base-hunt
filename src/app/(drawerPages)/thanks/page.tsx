'use client';

import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import Image from 'next/image';
import { useMemo } from 'react';
import Text from '@/components/Text';
import { LevelBadgesRow } from '@/components/assets/icons/LevelBadgesRow';
import { BaseHuntHero } from '@/components/assets/BaseHuntHero';
import { Color } from '@/constants/color';
import { useGameInfoContext } from '@/context/GameInfoContext';
import { BootstrapDialog } from '@/components/BoostrapDialog';

export default function Thanks() {
  const theme = useTheme();
  const smallerThanSm = useMediaQuery(theme.breakpoints.down('sm'));
  const { showModal, setShowModal } = useGameInfoContext();

  const qrSizes = useMemo(() => {
    return smallerThanSm ? 200 : 500;
  }, [smallerThanSm]);

  const message = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_KILL_SWITCH_MESSAGE ?? 'Basehunt is coming...'
    );
  }, []);

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
          <Box gap={2}>
            <Text variant="body2" textAlign="center" color={Color.White}>
              Base Hunt spans 7 days and ends March 3rd at 5 PM MST.
            </Text>
            <Text variant="body2" align="center" color={Color.White}>
              Trust us, use Coinbase Wallet if you want to win.
            </Text>
          </Box>
        </Stack>
      </Stack>
      <Stack
        direction="column"
        alignItems="center"
        width="100%"
        justifyContent="center"
        gap={2}
      >
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
              disabled
            >
              {message}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <BootstrapDialog
        onClose={() => setShowModal(false)}
        aria-labelledby="customized-dialog-title"
        open={showModal}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, alignContent: 'center', textAlign: 'center' }}
          id="customized-dialog-title"
        >
          Download Coinbase Wallet
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Text gutterBottom lineHeight="160%" align="center">
            Get the best experience in the Coinbase Wallet Mobile App.
          </Text>
          <Image
            src="/images/eth-denver.png"
            alt="Coinbase Wallet QR Code"
            height={qrSizes}
            width={qrSizes}
          />
        </DialogContent>
      </BootstrapDialog>
    </Stack>
  );
}
