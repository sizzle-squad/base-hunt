import React from 'react';
import Lottie from 'react-lottie';
import animationData from './BaseHunt_Stacked.json'; // Update with the path to your Lottie file
import { Box, Card } from '@mui/material';

const BaseHuntAnimated = ({
  width,
  height,
}: {
  width: string;
  height: string;
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions} height={height} width={width} />;
};

export default BaseHuntAnimated;
