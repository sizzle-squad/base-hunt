import Layout from '@/components/layout';
import { Jumbotron } from '@/components/assets/Jumbotron';
import Head from 'next/head';
import { Button, Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Color } from '@/constants/color';
import { relative } from 'path';
export default function Home() {
  return (
    <>
      <Head>
        <title>Base Hunt</title>
        <meta name="description" content="Base Hunt" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Jumbotron
          imageUrl="/images/map.png"
          isCircular
          width={300}
          height={300}
        />
        <Stack gap={1} paddingTop={10} alignItems="center">
          <Typography variant="h4" align="center" fontWeight="fontWeightBold">
            Onchain Odyssey
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color={Color.ForegroundMuted}
          >
            Collect onchain art across Miami and exchange it for exclusive
            merch.
          </Typography>
        </Stack>
        <Stack paddingTop={5} alignItems="center">
          <Button
            variant="contained"
            color="primary"
            sx={{ py: 2, px: 5, fontSize: '22px', backgroundColor: '#000000' }}
          >
            Start Exploring
          </Button>
        </Stack>
        <Stack gap={1} alignItems="center" paddingY={5}>
          <Typography variant="subtitle2">Coinbase Wallet Required</Typography>
          <Link href="/" variant="body1" underline="none">
            Download Here
          </Link>
        </Stack>
      </Layout>
    </>
  );
}
