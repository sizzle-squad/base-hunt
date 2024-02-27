'use client';

import { Button } from '@mui/material';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import Text from '@/components/Text';

type Props = {
  variant?: 'text' | 'outlined' | 'contained';
  fontSize?: string;
  px?: number;
  backgroundColor?: string;
  color?: string;
  py?: string;
};

export function ConnectButton({
  variant = 'contained',
  backgroundColor = '#000000',
  color = '#FFFFFF',
  py = '20px',
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
              py,
              px: 3,
              backgroundColor,
              width: '100%',
              borderRadius: '12px',
            }}
            onClick={openConnectModal}
          >
            <Text color={color}>
              {!connected ? 'Connect Wallet' : 'Disconntect'}
            </Text>
          </Button>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
