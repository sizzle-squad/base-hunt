import Image from 'next/image';
import { Box } from '@mui/material';
import React from 'react';
import Navbar from '../navigation/navbar';
import bgImage from '../../../public/images/bg.png';
import HeroSVG from '@/components/assets/HeroSVG';

const Hero = () => {
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
        }}
      >
        <HeroSVG />
      </Box>
    </Box>
  );
};

export default Hero;
