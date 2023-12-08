import { Box, Stack } from '@mui/material';
import { memo } from 'react';
import HeroSVG from '@/components/assets/HeroSVG';
import Text from '@/components/Text';
import Navbar from '@/components/navigation/navbar';
import Pill from '@/components/Pill';
import { useGameInfoContext } from '@/context/GameInfoContext';

const Hero = () => {
  const { setShowModal } = useGameInfoContext();
  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };
  return (
    <Stack width="100%" flexDirection="column" mt="1rem" paddingTop={1}>
      <Navbar />
      <Box>
        <Stack
          flexDirection="column"
          alignItems="center"
          gap="1rem"
          justifyContent="center"
          width="100%"
          paddingY="1.5rem"
        >
          <HeroSVG />
          <Pill onClick={toggleModal} hover>
            <Text>How to Play</Text>
          </Pill>
        </Stack>
      </Box>
    </Stack>
  );
};

export default memo(Hero);
