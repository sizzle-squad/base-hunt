import { memo } from 'react';
import Box from '@mui/material/Box';

function StepDiv({
  isActive,
  step,
  handleClick,
}: {
  isActive: boolean;
  step: number;
  handleClick: (step: number) => void;
}) {
  return (
    <Box
      onClick={() => handleClick(step)}
      sx={{
        backgroundColor: isActive
          ? 'var(--Black, #1d1818)'
          : 'var(--Gray, #e3e3e3)',
        display: 'flex',
        width: '100%',
        height: '2px',
        flexDirection: 'column',
      }}
    />
  );
}

function Stepper({
  activeStep,
  onClick,
}: {
  activeStep: number;
  onClick: (step: number) => void;
}) {
  const handleClick = (step: number) => {
    onClick(step);
  };

  return (
    <Box
      sx={{
        alignSelf: 'stretch',
        display: 'flex',
        gap: '8px',
        justifyContent: { xs: 'center', md: 'flex-start' },
        ':hover': {
          cursor: 'pointer',
        },
      }}
    >
      <StepDiv isActive={activeStep === 0} handleClick={handleClick} step={0} />
      <StepDiv isActive={activeStep === 1} handleClick={handleClick} step={1} />
      <StepDiv isActive={activeStep === 2} handleClick={handleClick} step={2} />
    </Box>
  );
}

export default memo(Stepper);
