import { Button } from '@mui/material';
import { ConnectKitButton } from 'connectkit';

export function ConnnectButton() {
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
            variant="contained"
            color="primary"
            sx={{ py: 2, px: 5, fontSize: '22px', backgroundColor: '#000000' }}
            onClick={show}
          >
            {isConnected
              ? ensName ?? truncatedAddress
              : isConnecting
              ? 'Connecting...'
              : 'Start Exploring'}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
