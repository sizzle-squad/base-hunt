'use client';
import LinearProgress from '@mui/material/LinearProgress';
import { useProgress } from '@/context/NavigationContext';
import { useEffect, useState } from 'react';

export const NavigationProgressBar = () => {
  const { progress } = useProgress();

  // useEffect(() => {
  //   setProgress(0);
  // }, []);

  return (
    <>
      {Boolean(progress) && (
        <LinearProgress
          variant="determinate"
          sx={{
            borderRadius: '6.25rem',
            height: '10px',
            backgroundColor: 'transparent',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'var(--CB-Blue, #0052FF)', // Color for the progress indicator
              animationDuration: '2s', // Increase this value to slow down the animation
              borderRadius: '6.25rem',
            },
            '& .MuiLinearProgress-bar2Indeterminate': {
              backgroundColor: 'transparent', // Color for the progress indicator
            },
          }}
          value={progress}
        />
      )}
    </>
  );
};
