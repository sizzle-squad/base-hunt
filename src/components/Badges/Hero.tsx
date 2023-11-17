import { Box, Card, LinearProgress, Stack } from '@mui/material';
import { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useScore } from '@/hooks/useScore';
import { useAccount } from 'wagmi';
import BaseHuntAnimated from './AnimatedHero';

const Navbar = dynamic(() => import('@/components/navigation/navbar'), {
  ssr: false,
});

const LevelsProgressBar = ({ progress }: { progress: number }) => (
  <Box
    sx={{
      borderRadius: '6.25rem',
      height: '4px',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    }}
  >
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        borderRadius: '6.25rem',
        backgroundColor: 'transparent', // To make the unused part of the progress bar transparent
        '& .MuiLinearProgress-bar': {
          backgroundColor: 'var(--Hive-Green, #e1ff67)', // Color for the progress indicator
        },
      }}
    />
  </Box>
);

type LevelsBarProps = {
  currentLevel: number;
  nextLevel: number;
  threshold: number;
  progress: number;
};

function LevelsBar({
  currentLevel,
  nextLevel,
  threshold,
  progress,
}: LevelsBarProps) {
  return (
    <Box
      sx={{
        borderRadius: '0.75rem',
        backgroundColor: 'var(--Black, #0a0b0d)',
        display: 'flex',
        flexDirection: 'column',
        p: { xs: '0 20px' },
        zIndex: 2,
        bottom: 0,
        width: '100%',
        position: 'relative',
      }}
    >
      <Stack
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box width="100%">
          <Box
            sx={{
              color: 'var(--Hive-Green, #e1ff67)',
              fontFeatureSettings: '"clig" off, "liga" off',
              letterSpacing: '-0.5px',
              mt: '16px',
              whiteSpace: { xs: 'initial', sm: 'nowrap' },
              typography: 'body1',
            }}
          >
            You are at Level {currentLevel}
          </Box>
          <Box
            sx={{
              borderRadius: '6.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              mt: '8px',
              flexDirection: 'column',
              alignItems: 'start',
            }}
          >
            <LevelsProgressBar progress={progress} />
          </Box>
        </Box>
        <Stack sx={{ position: 'relative', right: '10px' }}>
          {/* from figma */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="18"
            viewBox="0 0 15 18"
            fill="none"
          >
            <path d="M0 0H15V14.5L7.5 18L0 14.5V0Z" fill="#E1FF67" />
          </svg>
        </Stack>
      </Stack>
      <Box
        sx={{
          color: 'var(--White, #fff)',
          fontFeatureSettings: '"clig" off, "liga" off',
          whiteSpace: { xs: 'initial', sm: 'nowrap' },
          m: '8px 0 16px',
          typography: 'caption',
        }}
      >
        <span
          style={{ fontFamily: 'Coinbase Sans, sans-serif', fontWeight: 700 }}
        >
          {threshold} more
        </span>
        <span
          style={{ fontFamily: 'Coinbase Sans, sans-serif', fontWeight: 400 }}
        >
          {' '}
          points needed to reach Level {nextLevel}
        </span>
      </Box>
    </Box>
  );
}

const Hero = () => {
  const { address: userAddress = '' } = useAccount();
  const gameId = process.env.NEXT_PUBLIC_GAME_ID || '0';
  const { data } = useScore({
    userAddress,
    gameId,
  });

  const nextLevel = useMemo(() => {
    if (!data || !data.nextLevel) return 2;
    return data.nextLevel.level ?? 2;
  }, [data]);

  const currentLevel = useMemo(() => {
    if (!data || !data.currentLevel) return 1;
    return data.currentLevel.level ?? 1;
  }, [data]);

  const threshold = useMemo(() => {
    // user is yet to play the game so threshold is 2 to reach level 2.
    // all player starts at level 1, not 0
    if (
      !data ||
      !data.score?.currentScore ||
      !data.currentLevel?.thresholdPoints
    )
      return 2;
    return Number(
      data.score?.currentScore - data.currentLevel?.thresholdPoints
    );
  }, [data]);

  const progress = useMemo(() => {
    if (
      !data ||
      !data.nextLevel?.thresholdPoints ||
      // !data.score?.currentScore ||
      !data.currentLevel?.thresholdPoints
    )
      return 0;

    const denom = Number(
      data.nextLevel?.thresholdPoints - data.currentLevel?.thresholdPoints
    );

    return (threshold / denom) * 100;
  }, [data, threshold]);

  return (
    <Stack gap="1rem" width="100%" flexDirection="column" mt="1rem">
      <Navbar />
      <Card sx={{ borderRadius: '.75rem' }}>
        <BaseHuntAnimated width="100%" height="100%" />
      </Card>
      {/* TODO: temp to surpress type errors, update types once settled */}
      <LevelsBar
        currentLevel={currentLevel as number}
        nextLevel={nextLevel as number}
        threshold={threshold as number}
        progress={progress as number}
      />
    </Stack>
  );
};

export default memo(Hero);
