import LinearProgress from '@mui/material/LinearProgress';
import { useProgress } from '@/context/NavigationContext';
import { useEffect, useState } from 'react';

export const NavigationProgressBar = () => {
  const { isProgressing } = useProgress();
  const [progress, setProgress] = useState(0);
  return (
    <>
      {isProgressing && (
        <LinearProgress
          variant="indeterminate"
          sx={{
            borderRadius: '6.25rem',
            height: '10px',
            backgroundColor: 'transparent',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'var(--CB-Blue, #0052FF)', // Color for the progress indicator
              animationDuration: '2s', // Increase this value to slow down the animation
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
