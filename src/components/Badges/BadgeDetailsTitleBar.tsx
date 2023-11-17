import { Stack, Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

const BadgeDetailsTitleBar = ({ owned }: { owned: boolean }) => (
  <Stack
    alignItems="center"
    marginTop="24px"
    position={'relative'}
    width={'100%'}
  >
    <Box
      sx={{
        position: 'absolute',
        left: '20px',
      }}
    >
      <Link href="/badges">
        <Image
          src={
            owned ? '/images/icon-back-light.png' : '/images/icon-back-dark.png'
          }
          alt="Back Button"
          height={24}
          width={24}
        />
      </Link>
    </Box>
    <Typography
      sx={{
        fontFamily: 'CoinbaseDisplay',
        fontSize: '1.25rem',
        fontWeight: 400,
        color: owned ? '#FFFFFF' : '#1D1818',
      }}
    >
      View Badge
    </Typography>
  </Stack>
);

export default BadgeDetailsTitleBar;
