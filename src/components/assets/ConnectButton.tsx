import { Button } from '@mui/material';
import { ConnectKitButton } from 'connectkit';
import { useMemo } from 'react';

type Props = {
  variant?: 'text' | 'outlined' | 'contained';
  fontSize?: string;
  px?: number;
};

export function ConnectButton({
  variant = 'contained',
  fontSize = '22px',
  px = 5,
}: Props) {
  const backgroundColor = useMemo(() => {
    return variant === 'contained' ? '#000000' : undefined;
  }, []);

  return (
    <ConnectKitButton.Custom>
      {({
        isConnected,
        isConnecting,
        show,
        hide,
        address,
        ensName,
        chain,
        truncatedAddress,
      }) => {
        return (
          <Button
            variant={variant}
            color="primary"
            sx={{ py: 2, px, fontSize, backgroundColor }}
            onClick={show}
          >
            {isConnected
              ? 'Disconnect'
              : isConnecting
              ? 'Connecting...'
              : 'Connect Wallet'}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
