import { memo, useCallback } from 'react';

import { Box, Stack } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import HeroSVG from '@/components/assets/HeroSVG';
import Navbar from '@/components/navigation/navbar';
import Text from '@/components/Text';
import { useGameInfoContext } from '@/context/GameInfoContext';
import Pill from '../Pill';

const Hero = () => {
  const { showModal, setShowModal } = useGameInfoContext();

  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
  }, [setShowModal]);

  return (
    <Stack width="100%" flexDirection="column" mt="1rem" paddingTop={1}>
      <Navbar />
      <Box>
        <Stack
          gap={3}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          paddingY="1.5rem"
        >
          <HeroSVG />
          <Pill backgroundColor="non" onClick={toggleModal} hover>
            <Text>How it works</Text>
            {showModal ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Pill>
        </Stack>
      </Box>
    </Stack>
  );
};

export default memo(Hero);
