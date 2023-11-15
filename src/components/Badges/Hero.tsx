import Image from 'next/image';
import { Box, LinearProgress, Stack } from '@mui/material';
import { memo, useMemo } from 'react';
import bgImage from '../../../public/images/bg.png';
import HeroSVG from '@/components/assets/HeroSVG';
import dynamic from 'next/dynamic';
import { useScore } from '@/hooks/useScore';
import { useAccount } from 'wagmi';

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

const LevelsBar = ({
  currentLevel,
  nextLevel,
  threshold,
}: {
  currentLevel: number;
  nextLevel: number;
  threshold: number;
}) => (
  <Box
    sx={{
      backgroundColor: 'var(--Black, #0a0b0d)',
      display: 'flex',
      flexDirection: 'column',
      p: { xs: '0 20px' },
      zIndex: 2,
      position: 'absolute',
      bottom: 0,
      width: '100%',
    }}
  >
    <Stack
      width="100%"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
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
          {/* progress bar */}
          <LevelsProgressBar progress={10} />
        </Box>
      </Box>
      <Stack>
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
        NFTs needed to reach Level {nextLevel}
      </span>
    </Box>
  </Box>
);

const Hero = () => {
  const { address: userAddress = '' } = useAccount();
  const gameId = process.env.NEXT_PUBLIC_GAME_ID || '0';
  const { data } = useScore({
    userAddress,
    gameId,
  });

  const nextLevel = useMemo(() => {
    if (!data || !data.nextLevel) return 2;
    return data.nextLevel.id ?? 2;
  }, [data]);

  const currentLevel = useMemo(() => {
    if (!data || !data.currentLevel) return 1;
    return data.currentLevel.id ?? 1;
  }, [data]);

  const threshold = useMemo(() => {
    if (!data || !data.nextLevel?.thresholdPoints) return 0;
    return data.nextLevel.thresholdPoints ?? 0;
  }, [data]);
  return (
    <Box position="relative" width="100%">
      <Box>
        <Image
          src={bgImage}
          width={700}
          height={475}
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
          }}
          alt="Base Hunt 2023"
        />
      </Box>
      <Navbar />
      <Box
        sx={{
          position: 'absolute',
          bottom: '0%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 1,
        }}
      >
        <HeroSVG />
      </Box>
      {/* TODO: temp to surpress type errors, update types once settled */}
      <LevelsBar
        currentLevel={currentLevel as number}
        nextLevel={nextLevel as number}
        threshold={threshold as number}
      />
    </Box>
  );
};

export default memo(Hero);
