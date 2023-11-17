import { Box } from '@mui/material';
import { memo } from 'react';

import Text from '@/components/Text';
import { ConnectKitButton } from 'connectkit';

export const RetryDrawer = memo(() => (
  <Box
    sx={{
      justifyContent: 'center',
      alignSelf: 'stretch',
      boxShadow: '0px -12px 24px 0px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // Replace var(--sheet-white) with actual color if needed
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px',
    }}
  >
    <Text
      sx={{
        color: '#000',
        marginTop: '24px',
        fontWeight: 400,
        fontSize: '24px',
        lineHeight: '35px',
      }}
    >
      Hold up
    </Text>
    <Text
      sx={{
        color: '#000',
        marginTop: '8px',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '24px',
      }}
    >
      There was an issue connecting your wallet. <br />
      You may want to try again.
    </Text>
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show }) => {
        return (
          <Box
            onClick={show}
            sx={{
              justifyContent: 'space-between',
              borderRadius: '0.75rem',
              backgroundColor: '#1d1818',
              display: 'flex',
              gap: '20px',
              margin: '24px 0',
              padding: '1.25rem 1.5rem',
            }}
          >
            <Text
              sx={{
                color: '#fff',
                letterSpacing: '-0.5px',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '23px',
              }}
            >
              {isConnecting ? 'Connecting...' : 'Retry connection'}
            </Text>
            <Box
              component="img"
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d10df367-e718-495e-9030-b99792ff2050?"
              sx={{
                aspectRatio: '1',
                objectFit: 'contain',
                objectPosition: 'center',
                width: '24px',
                overflow: 'hidden',
                maxWidth: '100%',
              }}
            />
          </Box>
        );
      }}
    </ConnectKitButton.Custom>
  </Box>
));

RetryDrawer.displayName = 'RetryDrawer';
