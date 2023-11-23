import * as React from 'react';
import {
  Stack,
  Box,
  Typography,
  Card,
  CardMedia,
  LinearProgress,
} from '@mui/material';
import Text from '@/components/Text';
import { ArtRevealProgressBar } from '../assets/ArtRevealProgressBar';

export function TreasureChest() {
  return (
    <Card
      sx={{
        p: '20px',
        borderRadius: '12px',
        bgcolor: 'white',
        overflow: 'visible',
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        gap="16px"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={0}
          position="relative"
        >
          <Text variant="h5" fontSize="24px">
            Treasure Chest
          </Text>
          <CardMedia
            component="img"
            image="https://cdn.builder.io/api/v1/image/assets/TEMP/0b51b0ed-d493-4d87-88b1-7e12bb79878e?"
            sx={{
              position: 'absolute',
              top: '-24px',
              right: 0,
              width: 72,
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
        </Stack>
        <Stack direction="row" gap="2px" alignItems="center">
          <Text variant="h5">500</Text>
          <Box>/</Box>
          <Text variant="body2" noWrap>
            1000 hp
          </Text>
        </Stack>
        {/* TODO: Hardcoded till we create/connect data-layer */}
        <ArtRevealProgressBar progress={50} />
        <Box
          sx={{
            px: '20px',
            py: '16px',
            borderRadius: '1rem',
            bgcolor: 'text.primary',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Text color="#fff">Treasure Chest CTA</Text>
        </Box>
      </Stack>
    </Card>
  );
}
