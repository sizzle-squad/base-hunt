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
  }, [variant]);

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show }) => {
        return (
          <Button
            variant={variant}
            color="primary"
            sx={{
              py: '20px',
              px: 3,
              fontSize: '16px',
              backgroundColor: '#000000',
              width: '100%',
              borderRadius: '12px',
              fontFamily: 'CoinbaseMono',
              fontWeight: 400,
            }}
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
