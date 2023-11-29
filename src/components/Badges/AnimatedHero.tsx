import React from 'react';
import Lottie from 'react-lottie';
import animationData from './Base-Hunt_Wb_12_transparent.json';

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
