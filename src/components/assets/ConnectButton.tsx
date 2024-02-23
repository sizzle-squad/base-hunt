'use client';

import { Button } from '@mui/material';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';

type Props = {
  variant?: 'text' | 'outlined' | 'contained';
  fontSize?: string;
  px?: number;
  backgroundColor?: string;
  color?: string;
};

export function ConnectButton({
  variant = 'contained',
  fontSize = '22px',
  px = 5,
  backgroundColor = '#000000',
  color = '#FFFFFF',
}: Props) {
  return (
    <RainbowConnectButton.Custom>
      {({ openConnectModal, mounted, account, chain }) => {
        const connected = mounted && account && chain;

        return (
          <Button
            variant={variant}
            color="primary"
            sx={{
              py: '20px',
              px: 3,
              fontSize: '16px',
              backgroundColor,
              width: '100%',
              borderRadius: '12px',
              fontFamily: 'CoinbaseMono',
              fontWeight: 400,
              color,
            }}
            onClick={openConnectModal}
          >
            {!connected ? 'Connect Wallet' : 'Disconntect'}
          </Button>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
