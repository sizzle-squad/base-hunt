import React from 'react';

import { Box } from '@mui/material';

const Circle = ({ color, size = '2rem' }: { color: string; size?: string }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    ></Box>
  );
};

export default Circle;
