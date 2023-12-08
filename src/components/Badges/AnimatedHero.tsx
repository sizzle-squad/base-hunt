import React from 'react';
import Lottie from 'react-lottie';
import animationData from './BaseHunt_Stacked.json'; // Update with the path to your Lottie file
import { Box, Card } from '@mui/material';

const BaseHuntAnimated = ({
  width,
  height = 'auto',
}: {
  width: string;
  height?: string;
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Box width={['80%', '60%', '40%']}>
      <Lottie options={defaultOptions} height={height} width={width} />
    </Box>
  );
};

export default BaseHuntAnimated;
